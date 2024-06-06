// ==UserScript==
// @name         ChatGPT Word Frequency Tracker
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Tracks word frequency in assistant messages after the stop button disappears.
// @match        https://chatgpt.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';

    // CONFIG object for easy adjustments
    const CONFIG = {
        targetElementSelector: '.absolute.bottom-1.right-2.p-1.md\\:right-3.md\\:p-2 .flex.h-full .flex.h-full.flex-row.items-center.justify-center.gap-3 button[aria-label="Stop generating"]',
        assistantMessageSelector: 'div[data-message-author-role="assistant"] div.prose',
        mutationObserverConfig: { childList: true, subtree: true },
        checkInterval: 1000
    };

    let elementVisible = false; // Track the visibility state of the element

    // Function to handle page load and address bar changes
    const handlePageChange = () => {
        setTimeout(checkForStopButton, CONFIG.checkInterval); // Give some time for content to load
    };

    // Override pushState and replaceState to detect URL changes
    const originalPushState = history.pushState;
    history.pushState = function(...args) {
        originalPushState.apply(this, args);
        handlePageChange();
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function(...args) {
        originalReplaceState.apply(this, args);
        handlePageChange();
    };

    // Function to check for the stop button
    const checkForStopButton = () => {
        const stopButton = document.querySelector(CONFIG.targetElementSelector);
        if (stopButton && !elementVisible) {
            console.log('Stop button appeared:', stopButton);
            elementVisible = true;
        } else if (!stopButton && elementVisible) {
            console.log('Stop button disappeared');
            elementVisible = false;
            updateWordFrequency();
        }
    };

    // Function to get the word frequency from storage
    const getWordFrequency = () => {
        return GM_getValue('wordFrequency', {});
    };

    // Function to set the word frequency in storage
    const setWordFrequency = (wordFrequency) => {
        GM_setValue('wordFrequency', wordFrequency);
    };

    // Function to update the word frequency list
    const updateWordFrequency = () => {
        let wordFrequency = getWordFrequency();
        const assistantMessages = document.querySelectorAll(CONFIG.assistantMessageSelector);
        assistantMessages.forEach(message => {
            const words = message.innerText.split(/\s+/);
            words.forEach(word => {
                const cleanedWord = word.toLowerCase().replace(/[^a-z0-9]/g, '');
                if (cleanedWord) {
                    if (wordFrequency[cleanedWord]) {
                        wordFrequency[cleanedWord]++;
                    } else {
                        wordFrequency[cleanedWord] = 1;
                    }
                }
            });
        });
        setWordFrequency(wordFrequency);
        console.log('Updated word frequency:', wordFrequency);
    };

    // Select the target node
    const targetNode = document.body;

    // Callback function to execute when mutations are observed
    const callback = function(mutationsList) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                checkForStopButton();
            }
        }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, CONFIG.mutationObserverConfig);

    // Add event listeners for page load and address bar changes
    window.addEventListener('load', handlePageChange);
    window.addEventListener('popstate', handlePageChange);
})();
