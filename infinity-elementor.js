<script type="text/javascript">

var _ictt = _ictt || [];

_ictt.push(['_setIgrp', '3788']);

_ictt.push([
    '_enableGAIntegration',
    {
        'gua': true,
        'ga': false
    }
]);

_ictt.push(['_enableClasslessReplacements']);


/*
 * Returns true if the supplied text looks like a phone number.
 */
function infinityIsPhoneNumber(text) {

    if (!text) {
        return false;
    }

    return /(?:\+44[\s.-]?\d{3,5}[\s.-]?\d{3,4}[\s.-]?\d{3,4}|0\d{2,5}[\s.-]?\d{3,4}[\s.-]?\d{3,4})/.test(
        text.trim()
    );
}


/*
 * Update visible phone numbers after Infinity has replaced
 * the href with the allocated tracking number.
 */
function infinityUpdateVisibleNumbers() {

    var links = document.querySelectorAll(
        'a[href^="tel:"]'
    );

    Array.prototype.forEach.call(links, function (link) {

        var textElement = link.querySelector(
            '.elementor-button-text'
        );

        /*
         * Elementor button:
         * update only the button text.
         */
        if (textElement) {

            var buttonText = textElement.textContent.trim();

            if (!infinityIsPhoneNumber(buttonText)) {
                return;
            }

            var buttonHref = link.getAttribute('href') || '';

            if (!/^tel:/i.test(buttonHref)) {
                return;
            }

            var buttonNumber = buttonHref
                .replace(/^tel:/i, '')
                .split('?')[0]
                .trim();

            if (buttonNumber) {
                textElement.textContent = buttonNumber;
            }

            return;
        }


        /*
         * Normal text link, such as:
         *
         * <h2>
         *   <a href="tel:01174533802">+441179490155</a>
         * </h2>
         */
        var linkText = link.textContent.trim();

        if (!infinityIsPhoneNumber(linkText)) {
            return;
        }

        var href = link.getAttribute('href') || '';

        if (!/^tel:/i.test(href)) {
            return;
        }

        var replacementNumber = href
            .replace(/^tel:/i, '')
            .split('?')[0]
            .trim();

        if (replacementNumber) {
            link.textContent = replacementNumber;
        }

    });
}


/*
 * Run after Infinity has completed number replacement.
 */
_ictt.push([
    '_addCallback',
    infinityUpdateVisibleNumbers,
    {
        eventName: 'afterNumberReplace',
        maxRunCount: 20
    }
]);


/*
 * Find all telephone links and configure them for Infinity.
 */
function setupInfinityTelephoneLinks(root) {

    var links = [];


    if (
        root &&
        root.nodeType === 1 &&
        root.matches &&
        root.matches('a[href^="tel:"]')
    ) {
        links.push(root);
    }


    if (root && root.querySelectorAll) {

        links = links.concat(
            Array.prototype.slice.call(
                root.querySelectorAll('a[href^="tel:"]')
            )
        );

    }


    links.forEach(function (link) {

        var href = link.getAttribute('href') || '';

        if (!/^tel:/i.test(href)) {
            return;
        }

        var discoveryNumber = href
            .replace(/^tel:/i, '')
            .split('?')[0]
            .trim();

        if (!discoveryNumber) {
            return;
        }


        /*
         * Add Infinity targeting.
         */
        link.classList.add('InfinityNumber');

        link.setAttribute(
            'data-ict-discovery-number',
            discoveryNumber
        );


        /*
         * Always use silent replacement on the anchor.
         *
         * This means Infinity changes the href but does not
         * destroy Elementor icons or text such as "Call Now".
         *
         * The callback above handles visible phone numbers.
         */
        link.setAttribute(
            'data-ict-silent-replacements',
            'true'
        );

    });

}


/*
 * Initial setup.
 */
function initialiseInfinity() {

    setupInfinityTelephoneLinks(document);

    /*
     * Start Infinity.
     */
    _ictt.push(['_track']);


    /*
     * Handle links added later by Elementor.
     */
    if (window.MutationObserver) {

        var observer = new MutationObserver(function (mutations) {

            var foundNewLinks = false;

            mutations.forEach(function (mutation) {

                Array.prototype.forEach.call(
                    mutation.addedNodes,
                    function (node) {

                        if (node.nodeType !== 1) {
                            return;
                        }

                        var before = document.querySelectorAll(
                            'a[href^="tel:"]'
                        ).length;

                        setupInfinityTelephoneLinks(node);

                        var after = document.querySelectorAll(
                            'a[href^="tel:"]'
                        ).length;

                        if (after > before) {
                            foundNewLinks = true;
                        }

                    }
                );

            });


            if (foundNewLinks) {

                _ictt.push([
                    '_allocate',
                    infinityUpdateVisibleNumbers
                ]);

            }

        });


        observer.observe(
            document.documentElement,
            {
                childList: true,
                subtree: true
            }
        );

    }

}


/*
 * Wait for DOM.
 */
if (document.readyState === 'loading') {

    document.addEventListener(
        'DOMContentLoaded',
        initialiseInfinity
    );

} else {

    initialiseInfinity();

}


/*
 * Load Infinity.
 */
(function () {

    var ict = document.createElement('script');

    ict.type = 'text/javascript';
    ict.async = true;

    ict.src =
        ('https:' == document.location.protocol
            ? 'https://'
            : 'http://') +
        'ict.infinity-tracking.net/js/nas.v1.min.js';

    var scr =
        document.getElementsByTagName('script')[0];

    scr.parentNode.insertBefore(ict, scr);

})();


</script>
