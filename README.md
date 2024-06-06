# ChatGPT Word Frequency Tracker

This Tampermonkey userscript tracks the frequency of words used by the ChatGPT assistant after the "Stop generating" button disappears. It continuously updates a word frequency list and keeps a permanent track record using `GM_setValue` and `GM_getValue`.

## Features

- **Stop Button Detection**: Detects when the "Stop generating" button appears and disappears.
- **Word Frequency Tracking**: Captures and processes text from assistant messages to update word frequency.
- **Persistent Storage**: Uses `GM_setValue` and `GM_getValue` to store and retrieve word frequency data, ensuring persistence across sessions.

## Installation

1. **Install Tampermonkey**:
   - [Tampermonkey's homepage](https://www.tampermonkey.net/) provides installation instructions for various browsers.

2. **Install the Userscript**:
   - Open Tampermonkey and click on the "Add a new script" button.
   - Copy and paste the contents of the [userscript](userscript.js) into the Tampermonkey editor.
   - Save the script.

## Usage

1. Navigate to [ChatGPT](https://chatgpt.com/).
2. The script will automatically detect the appearance and disappearance of the "Stop generating" button.
3. After the "Stop generating" button disappears, the script will update the word frequency list with the latest text from the assistant's messages.
4. The word frequency list is stored persistently using Tampermonkey's storage capabilities.

## How It Works

- **Stop Button Detection**: Uses a MutationObserver to detect changes in the DOM and check for the presence of the "Stop generating" button.
- **Word Frequency Tracking**: After the "Stop generating" button disappears, the script extracts text from `div[data-message-author-role="assistant"] div.prose`, splits it into words, and updates the frequency count.
- **Persistent Storage**: Utilizes `GM_getValue` to retrieve the stored word frequency list and `GM_setValue` to save the updated list, ensuring data is preserved across sessions.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Feel free to open issues or submit pull requests for any improvements or bug fixes. Contributions are welcome!

## Contact

For any questions or suggestions, please open an issue on this repository.

---

This userscript is a simple tool for tracking word usage patterns in ChatGPT assistant messages, aimed at providing insights into the frequency of specific words. Enjoy using it and feel free to contribute!
