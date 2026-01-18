// Reverse AutoCorrect - Gets progressively weirder and ruder
$(document).ready(function() {
    const input = $('#rac');
    const resultsContainer = $('<div id="suggestions"></div>');
    $('.input_wrapper').after(resultsContainer);

    // Character substitution maps for generating "what you might have meant"
    const typoMaps = {
        // Common autocorrect substitutions
        mild: {
            'a': ['s', 'q', 'z'],
            'e': ['w', 'r', 'd'],
            'i': ['u', 'o', 'k'],
            'o': ['i', 'p', 'l'],
            'u': ['y', 'i', 'j'],
            's': ['a', 'd', 'w'],
            't': ['r', 'y', 'g'],
            'n': ['b', 'm', 'h'],
            'h': ['g', 'j', 'y'],
            'l': ['k', 'o', 'p']
        }
    };

    // Rude suggestions that escalate
    const rudePrefixes = [
        "Maybe you meant:",
        "Or possibly you tried to type:",
        "Wait, did you actually mean:",
        "Hold on... were you trying to say:",
        "Seriously though, you probably meant:",
        "No really, I think you meant:",
        "Oh for fuck's sake, you meant:",
        "Jesus Christ, just say:",
        "GODDAMMIT just type:",
        "WHAT THE ACTUAL FUCK, you clearly meant:"
    ];

    const rudeComments = [
        "",
        "",
        " (your fingers are fat btw)",
        " (did you fail typing class?)",
        " (maybe try typing slower, champ)",
        " (are you typing with your elbows?)",
        " (holy shit your spelling is terrible)",
        " (did you have a stroke?)",
        " (IS YOUR KEYBOARD BROKEN OR ARE YOU?)",
        " (I'M LOSING MY FUCKING MIND HERE)"
    ];

    function generateTypo(word, intensity) {
        if (word.length < 2) return word;

        let result = word;
        const numChanges = Math.min(Math.floor(intensity / 2) + 1, word.length);

        for (let i = 0; i < numChanges; i++) {
            const pos = Math.floor(Math.random() * result.length);
            const char = result[pos].toLowerCase();

            if (typoMaps.mild[char]) {
                const replacements = typoMaps.mild[char];
                const newChar = replacements[Math.floor(Math.random() * replacements.length)];
                result = result.substring(0, pos) + newChar + result.substring(pos + 1);
            } else {
                // Random: double letter, skip letter, or swap adjacent
                const action = Math.floor(Math.random() * 3);
                if (action === 0 && pos < result.length - 1) {
                    // Double letter
                    result = result.substring(0, pos) + result[pos] + result.substring(pos);
                } else if (action === 1 && result.length > 3) {
                    // Skip letter
                    result = result.substring(0, pos) + result.substring(pos + 1);
                } else if (action === 2 && pos < result.length - 1) {
                    // Swap adjacent
                    result = result.substring(0, pos) + result[pos + 1] + result[pos] + result.substring(pos + 2);
                }
            }
        }

        return result;
    }

    function generateSuggestions(text) {
        if (!text || text.trim().length === 0) {
            return [];
        }

        const words = text.split(/\s+/);
        const suggestions = [];

        // Generate 10 progressively weirder suggestions
        for (let level = 0; level < 10; level++) {
            const modifiedWords = words.map(word => {
                // Randomly decide whether to modify this word based on level
                if (Math.random() < 0.3 + (level * 0.07)) {
                    return generateTypo(word, level);
                }
                return word;
            });

            const suggestion = {
                text: modifiedWords.join(' '),
                prefix: rudePrefixes[level],
                comment: rudeComments[level],
                level: level
            };

            suggestions.push(suggestion);
        }

        return suggestions;
    }

    function displaySuggestions(suggestions) {
        resultsContainer.empty();

        if (suggestions.length === 0) {
            return;
        }

        const list = $('<ul class="suggestions-list"></ul>');

        suggestions.forEach((suggestion, index) => {
            const item = $('<li></li>')
                .addClass('suggestion-item')
                .addClass('level-' + suggestion.level)
                .attr('data-level', suggestion.level);

            const prefix = $('<span class="suggestion-prefix"></span>').text(suggestion.prefix);
            const text = $('<span class="suggestion-text"></span>').text(suggestion.text);
            const comment = $('<span class="suggestion-comment"></span>').text(suggestion.comment);

            item.append(prefix).append(' ').append(text).append(comment);
            list.append(item);

            // Animate in with delay
            setTimeout(() => {
                item.addClass('visible');
            }, index * 150);
        });

        resultsContainer.append(list);
    }

    // Debounce input
    let timeout;
    input.on('input', function() {
        const text = $(this).val();
        clearTimeout(timeout);

        if (text.trim().length === 0) {
            resultsContainer.empty();
            return;
        }

        timeout = setTimeout(() => {
            const suggestions = generateSuggestions(text);
            displaySuggestions(suggestions);
        }, 500);
    });
});
