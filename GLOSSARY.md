# Profile Site

A site presenting its owner professionally to recruiters, hiring managers and peers.

## Structure

**Profile Site**:
The whole site, in every Language.
_Avoid_: Profile page, portfolio, website

**Page**:
One route of the Profile Site, such as the home page. Every Page exists once per Language, except the Not Found Page.
_Avoid_: Screen, view, route (when meaning the visitor-facing page)

**Not Found Page**:
The Page shown for a URL that matches no other Page. It exists once per Language, plus once outside any Language (shown in the Default Language), and is never indexed.
_Avoid_: 404 page, error page

**Header**:
The strip above every Page's Sections that links home and switches Language; identical on every Page in a Language. Not a Section.
_Avoid_: Navbar, nav (in prose)

**Section**:
A block of content within a Page, below the Header.
_Avoid_: Part, component, widget (when meaning visitor-facing content)

## Languages

**Language**:
One of the languages the Profile Site is written in: `en` or `ru`.
_Avoid_: Locale, lang (in prose)

**Default Language**:
English (`en`): the source Language and the one a visitor gets when no other applies.
_Avoid_: Fallback locale, primary language

## Text

**UI Strings**:
The interface's own wording (navigation, labels, buttons), translated per Language.
_Avoid_: Translations, messages, copy

**Profile Content**:
The owner's data shown on Pages (headline, summary, experience, projects, links), written per Language and identical in shape across Languages.
_Avoid_: Content (unqualified), data, CMS content
