# Instructions for Re-implementing Infinity UK Call Tracking

## Purpose

Use this repository as the reference implementation for integrating Infinity Call Tracking with UK websites where telephone links need controlled DOM handling, particularly Elementor websites.

The existing code is a **template**. Do not copy it directly into another client's website without reviewing and updating the client-specific configuration and markup.

## Before changing anything

Inspect the target website and establish:

1. Infinity IGRP
2. Infinity Auto Discovery/base number
3. Existing Infinity tracking code
4. Telephone link markup
5. Visible telephone number markup
6. UK telephone number formats used on the site
7. Whether content is loaded dynamically

Do not assume these values are the same as the reference implementation.

---

## Client-specific values that MUST be changed

### 1. Infinity IGRP

The reference script contains:

```javascript
_ictt.push(['_setIgrp', '3788']);
```

`3788` is specific to the reference implementation.

Replace it with the target client's Infinity IGRP.

Do not leave `3788` in place unless the target client actually uses that IGRP.

---

### 2. Infinity Auto Discovery number

The reference implementation derives the discovery number from the `tel:` attribute, for example:

```html
<a href="tel:01179490155">
```

Do not copy this number into the new implementation.

The target site must use its own actual base/discovery number.

Check the Infinity portal and confirm that the number configured for the relevant tracking group matches the number used in the site's `tel:` links.

Do not assume that these are interchangeable:

```text
01179490155
+441179490155
0117 949 0155
```

Use the format required by the target client's Infinity configuration.

---

### 3. Existing Infinity configuration

The reference implementation contains:

```javascript
_ictt.push(['_enableGAIntegration', {
    'gua': true,
    'ga': false
}]);
```

Review this before reusing it.

Do not assume the target client's Google Analytics configuration is identical.

Preserve the client's existing Infinity configuration unless there is a specific reason to change it.

---

## Do not blindly copy selectors

The reference implementation uses:

```javascript
a[href^="tel:"]
```

and:

```javascript
.elementor-button
```

and:

```javascript
.elementor-button-text
```

These are appropriate for the reference Elementor implementation.

Inspect the target website before changing or adding selectors.

Examples:

```html
<a href="tel:02012345678">020 1234 5678</a>
```

may require no Elementor-specific selector.

An Elementor button may use:

```html
<a class="elementor-button" href="tel:02012345678">
```

A different page builder may use completely different classes.

Use the target site's actual DOM.

---

## Number matching MUST be reviewed

The reference implementation is designed for UK telephone numbers.

Do not assume the existing phone-number matching pattern will cover every UK number format used by another client.

Review the actual visible numbers on the target site.

Examples may include:

```text
020 1234 5678
02012345678
0117 123 4567
01171234567
0161 123 4567
+44 20 1234 5678
+442012345678
0800 123 4567
08001234567
```

Update the phone-number detection logic if required.

Do not make the pattern excessively broad, as this could cause ordinary numeric content to be treated as a telephone number.

---

## Visible phone number vs CTA text

The integration should distinguish between:

```html
<span class="elementor-button-text">
    +441179490155
</span>
```

and:

```html
<span class="elementor-button-text">
    Call Now
</span>
```

A visible telephone number should be synchronised with the Infinity tracking number.

Normal CTA text should remain unchanged.

Examples that should normally remain unchanged:

```text
Call Now
Call Us
Contact Us
Speak to the team
Get a quote
```

---

## Discovery number is taken from the tel: link

The `tel:` link is the source of truth for Infinity discovery.

Example:

```html
<a href="tel:01179490155">
```

The visible text may be formatted differently:

```html
<span>+441179490155</span>
```

Do not use the visible text as the discovery number when the `tel:` value is available.

---

## Dynamic content

The reference implementation uses `MutationObserver` because Elementor and other page builders may inject telephone links after the initial page load.

Check whether the target site uses:

* Elementor popups
* AJAX content
* dynamic menus
* mobile navigation
* dynamically loaded widgets

Keep the `MutationObserver` logic where dynamic telephone links are present.

If the target site does not dynamically inject telephone links, do not add unnecessary complexity purely because the reference implementation contains it.

---

## Existing Infinity classless replacement

The reference implementation includes:

```javascript
_ictt.push(['_enableClasslessReplacements']);
```

Review whether this should remain enabled.

Do not automatically enable both standard classless replacement and custom DOM replacement without understanding the target site's existing Infinity implementation.

Where custom handling is explicitly controlling the telephone links, avoid creating competing replacement mechanisms.

---

## Required implementation process

Follow this process:

### Step 1 - Inspect the target site

Identify all relevant telephone link structures.

At minimum check:

```javascript
document.querySelectorAll('a[href^="tel:"]')
```

Record the different structures found.

### Step 2 - Identify the client's Infinity configuration

Confirm:

* IGRP
* Auto Discovery/base number
* GA configuration
* Existing Infinity implementation

### Step 3 - Adapt the selectors

Update the reference selectors to match the target DOM.

### Step 4 - Adapt UK number detection

Review the phone-number matching logic against real numbers found on the target site.

### Step 5 - Implement

Modify the reference JavaScript rather than writing an unrelated implementation from scratch.

### Step 6 - Test

Test:

* Standard telephone links
* Elementor buttons
* Visible telephone numbers
* CTA text such as `Call Now`
* Multiple telephone numbers
* Dynamically loaded telephone links
* Desktop and mobile navigation
* Elementor popups where applicable

### Step 7 - Verify in DevTools

Check the final DOM.

For example:

```javascript
document.querySelectorAll('a[href^="tel:"]')
```

Confirm that:

* The `href` has been replaced by Infinity where expected.
* Visible phone numbers have been updated where expected.
* CTA text has remained unchanged.
* Elementor icons and markup have not been removed.

---

## Do not make these assumptions

Do not assume:

* The IGRP is `3788`
* The base number is `01179490155`
* The client uses the same UK number formats
* The site uses Elementor
* `.elementor-button-text` exists
* All telephone links are buttons
* All visible telephone numbers use `+44`
* All telephone links are present during initial page load
* Classless replacement should remain enabled

These values belong to the reference implementation and must be verified for each client.

---

## Keep the implementation minimal

Do not add extra callbacks, observers, selectors or replacement logic unless the target website requires them.

Start from the reference implementation and make the smallest changes necessary to support the target site's actual markup.

The objective is a maintainable client-specific implementation, not a universal telephone-number detection framework.

---

## Final checks before deployment

Confirm all of the following:

* [ ] Client IGRP is correct
* [ ] Client Auto Discovery number is correct
* [ ] Existing Infinity configuration has been reviewed
* [ ] Target telephone link selectors have been verified
* [ ] UK phone-number formats have been tested
* [ ] Visible phone numbers are replaced correctly
* [ ] CTA text such as `Call Now` is preserved
* [ ] Elementor/page-builder markup is preserved
* [ ] Dynamic content has been tested where applicable
* [ ] No duplicate or conflicting Infinity replacement mechanisms are active
* [ ] Cache/minification has been cleared and the production DOM has been tested

## Important

This repository is a **reference implementation for UK Infinity call tracking**, not a universal copy-and-paste script.

Every new client implementation must be reviewed against that client's:

* Infinity configuration
* telephone numbers
* HTML structure
* page builder
* number formats
* dynamic content

The goal is to reuse the proven integration pattern while adapting the configuration and DOM handling to the target website.
