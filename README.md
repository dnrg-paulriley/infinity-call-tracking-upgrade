# Infinity UK Call Tracking - Custom DOM Integration

Custom JavaScript integration for [Infinity Call Tracking](https://www.infinity.co/) designed for UK websites where telephone numbers are contained within complex page-builder markup, particularly Elementor.

The integration extends Infinity's standard number replacement approach by explicitly identifying `tel:` links and synchronising visible telephone numbers with the dynamically allocated tracking number.

## Why this exists

Infinity's standard classless replacement works well for straightforward telephone links and visible phone numbers.

On page-builder websites, telephone links can be wrapped in additional markup, for example:

```html
<a href="tel:01179490155">
    <span class="elementor-button-icon">...</span>
    <span class="elementor-button-text">+441179490155</span>
</a>
```

In these situations, relying solely on automatic classless replacement can be less predictable.

This integration gives us more control over:

* Which `tel:` links are tracked
* Which number is used for Infinity discovery
* How complex Elementor markup is preserved
* How visible telephone numbers are synchronised
* Telephone links added dynamically after page load

## What the script does

The script:

1. Finds telephone links using `a[href^="tel:"]`.
2. Reads the original number from the `tel:` attribute.
3. Adds the relevant Infinity attributes to the link.
4. Allows Infinity to replace the `href` with the allocated tracking number.
5. Preserves complex Elementor content such as icons and nested spans.
6. Updates visible UK telephone numbers to the allocated tracking number.
7. Leaves non-number CTA text such as `Call Now` unchanged.
8. Detects telephone links added dynamically after the initial page load.

## Supported UK number formats

The current implementation is intended for UK telephone numbers.

Examples include:

```text
01179490155
0117 949 0155
0117-949-0155
+441179490155
+44 117 949 0155
```

The exact formats supported depend on the phone-number matching pattern in the script.

## Important: this is a template, not a universal drop-in

The core integration can be reused across UK client websites, but the implementation should still be checked against each site's markup.

Before deploying, confirm:

* Infinity IGRP
* Infinity Auto Discovery number
* Telephone link markup
* Elementor/page-builder structure
* Visible telephone number formats
* Any dynamically loaded telephone links

Do not assume that every client uses the same HTML structure.

## How Infinity is configured

The number in the `tel:` attribute is treated as the source number for Infinity discovery.

For example:

```html
<a href="tel:01179490155">
```

The visible number may use a different UK presentation:

```html
<span>+441179490155</span>
```

The integration treats the `tel:` value as the source of truth and uses the Infinity-allocated number for the replacement.

## Elementor example

### Original

```html
<a class="elementor-button" href="tel:01179490155">
    <span class="elementor-button-icon">
        ...
    </span>
    <span class="elementor-button-text">
        +441179490155
    </span>
</a>
```

### After Infinity replacement

Conceptually:

```html
<a class="elementor-button" href="tel:019XXXXXXXX">
    <span class="elementor-button-icon">
        ...
    </span>
    <span class="elementor-button-text">
        019XXXXXXXX
    </span>
</a>
```

The Elementor icon and surrounding markup are preserved.

## CTA text

The integration distinguishes between telephone numbers and normal CTA text.

For example:

```html
<a href="tel:01179490155">+441179490155</a>
```

The visible number can be replaced.

Whereas:

```html
<a href="tel:01179490155">Call Now</a>
```

keeps `Call Now` as the visible text while Infinity still replaces the telephone destination.

## Other Elementor structures

The integration also supports telephone links that are not Elementor buttons.

For example:

```html
<h2>
    <a href="tel:01179490155">+441179490155</a>
</h2>
```

The same `tel:` link detection can be used to handle the number.

This is one reason the script targets:

```javascript
a[href^="tel:"]
```

rather than only:

```javascript
a.elementor-button
```

## UK number matching

The script contains a regular expression used to determine whether visible text is a telephone number.

This is deliberately designed around UK formats.

When adding a new UK number format, update the phone-number matching logic and test it against real client markup.

Do not make the matching pattern so broad that ordinary numeric content can be interpreted as a telephone number.

For example, avoid matching:

```text
2026
10% increase
£1,500
12345
```

as telephone numbers.

## Dynamic content

The script uses `MutationObserver` to detect telephone links added after the initial page load.

This is useful for:

* Elementor popups
* Mobile menus
* Dynamic Elementor widgets
* AJAX-loaded content
* Other DOM elements injected after page load

When new telephone links are detected, Infinity allocation is triggered again.

## Testing checklist

Test at least the following before deployment:

### Standard telephone link

```html
<a href="tel:01179490155">+441179490155</a>
```

Expected:

* `href` changes to the Infinity tracking number
* visible number changes to the allocated number

### Elementor button

```html
<a class="elementor-button" href="tel:01179490155">
    <span class="elementor-button-icon">...</span>
    <span class="elementor-button-text">+441179490155</span>
</a>
```

Expected:

* `href` changes
* visible number changes
* icon remains intact

### CTA button

```html
<a class="elementor-button" href="tel:01179490155">
    <span class="elementor-button-text">Call Now</span>
</a>
```

Expected:

* `href` changes
* `Call Now` remains unchanged

### Dynamically loaded content

Trigger any Elementor popup, mobile menu or dynamic component containing a telephone link.

Expected:

* new telephone link is detected
* Infinity replacement occurs
* visible telephone number is synchronised where applicable

## Troubleshooting

### The `href` does not change

Check:

1. The `tel:` number matches the configured Infinity Auto Discovery number.
2. The correct IGRP is being used.
3. Infinity's JavaScript is loading successfully.
4. The telephone link exists in the DOM.
5. There are no caching or script optimisation tools interfering with the script.

In DevTools:

```javascript
document.querySelectorAll('a[href^="tel:"]')
```

should return the telephone links.

### The `href` changes but visible text does not

Check:

1. The visible text actually contains a supported UK telephone format.
2. The number is inside the element being targeted.
3. The phone-number matching pattern recognises the format.
4. The visible text is not being rewritten by Elementor or another script after Infinity runs.

### Elementor icon disappears

The outer telephone link should use silent replacement so Infinity changes the destination without replacing the entire button contents.

Check for:

```html
data-ict-silent-replacements="true"
```

## Reusing the integration on another client

Use the existing script as the base rather than rewriting the integration.

Review these items for each implementation:

```text
1. IGRP
2. Auto Discovery number
3. Telephone link selector
4. Visible number selector
5. UK number formats
6. Dynamic content requirements
7. Existing Infinity configuration
```

The most likely changes will be configuration values, selectors and the UK phone-number matching pattern.

## Scope

This repository is intended for:

* UK websites
* Infinity Call Tracking
* WordPress
* Elementor and similar page builders
* Telephone links requiring controlled DOM handling

It is not intended to replace Infinity's standard integration in every situation.

Use the standard Infinity implementation where it provides reliable results without custom DOM handling.

## Versioning

When modifying the integration, test against:

* Standard telephone links
* Elementor telephone buttons
* Visible UK telephone numbers
* Non-number CTA text
* Dynamically loaded content

Document any changes to selectors, number matching or Infinity configuration in the commit message or release notes.

## Reference

Infinity JavaScript API documentation:

https://kb.infinity.co/knowledge-base/article/infinity-javascript-api-reference/

Infinity Auto Discovery documentation:

https://kb.infinity.co/knowledge-base/article/auto-discovery-number/

Infinity Click to Call documentation:

https://kb.infinity.co/knowledge-base/article/click-to-call/
