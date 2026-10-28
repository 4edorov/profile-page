# Profile Site

A site presenting its owner professionally to recruiters, hiring managers and peers.

## Structure

**Profile Site**:
The whole site, in every Language.
_Avoid_: Profile page, portfolio, website

**Page**:
One route of the Profile Site, such as the Home Page. Every Page exists once per Language, except the Not Found Page.
_Avoid_: Screen, view, route (when meaning the visitor-facing page)

**Home Page**:
The Page at a Language's root. It holds one Section per Topic except Contact, in Topic order, and nothing else.
_Avoid_: Landing page, index

**Topic**:
One subject of Profile Content, in this order: About, Experience, Projects, Learning, Contact. Every Topic has a Section: Contact's is in the Footer, every other one is on the Home Page and also has a Topic Page.
_Avoid_: Category, area, section (when meaning the subject rather than the block)

**Topic Page**:
The Page dedicated to one Topic, showing more than that Topic's Section on the Home Page.
_Avoid_: Detail page, subpage

**Entry**:
One item of Experience, Projects or Learning (a job, a project, a course). Written once per Language with a short summary and fuller detail. Every Entry appears on its Topic Page; only Featured Entries appear in its Topic's Section, and only by their summary.
_Avoid_: Item, record, card

**Featured Entry**:
An Entry the owner has chosen to show in its Topic's Section on the Home Page, in the same order as on its Topic Page.
_Avoid_: Highlight, pinned, top entry

**Resume Page**:
The Page showing the Resume in its Language. Not a Topic: it has no Section on the Home Page.
_Avoid_: CV page

**Resume**:
The owner's hand-made resume document, one per Language, maintained separately from Profile Content.
_Avoid_: CV

**Not Found Page**:
The Page shown for a URL that matches no other Page. It exists once per Language, plus once outside any Language (shown in the Default Language), and is never indexed.
_Avoid_: 404 page, error page

**Header**:
The strip above every Page's Sections that links to the Home Page, every Topic Page and the Resume Page, and switches Language and Theme; identical on every Page in a Language apart from marking the current Page. Stays in view while the Page scrolls. Not a Section.
_Avoid_: Navbar, nav (in prose), top bar

**Footer**:
The strip below every Page's other Sections, holding the Contact Section and nothing else; identical on every Page in a Language.
_Avoid_: Bottom bar

**Section**:
A block of content within a Page, below the Header.
_Avoid_: Part, component, widget (when meaning visitor-facing content)

**Page Metadata**:
A Page's title, description, canonical URL, Language alternates and link-preview tags, worded per Page in UI Strings and filled from its Language and Profile Content; no Page assembles its own. The Not Found Page has only a title and is never indexed.
_Avoid_: SEO tags, head, meta (in prose)

## Languages

**Language**:
One of the languages the Profile Site is written in: `en` or `ru`.
_Avoid_: Locale, lang (in prose)

**Default Language**:
English (`en`): the source Language and the one a visitor gets when no other applies.
_Avoid_: Fallback locale, primary language

## Text

**UI Strings**:
The Profile Site's own wording (navigation, labels, buttons, Page Metadata), translated per Language.
_Avoid_: Translations, messages, copy

**Profile Content**:
The owner's data shown on Pages, organised by Topic, written per Language and identical in shape across Languages, apart from how many Accents the tagline has.
_Avoid_: Content (unqualified), data, CMS content

**Learning**:
The Topic covering what the owner has studied or is studying: education, courses, certifications and books.
_Avoid_: Education (for the whole Topic), studies

**Contact**:
The Topic listing the ways to reach the owner, each one a link.
_Avoid_: Links, socials

**Stack**:
The languages and technologies the owner works with, as part of the About Topic. Identical in every Language.
_Avoid_: Skills, tech, tags

## Appearance

**Theme**:
How the Profile Site looks: Light or Dark. Every visit starts in Light, whatever the visitor's system setting; the visitor switches it from the Header, and the choice lasts while they move between Pages (including switching Language) but is never remembered, so a reload or new tab starts in Light again.
_Avoid_: Color scheme, mode, dark mode

**Accent**:
A run of words in the About tagline shown in the Theme's primary color, chosen by the owner per Language. Purely visual: it adds no emphasis for screen readers, and no other Profile Content has Accents.
_Avoid_: Highlight, emphasis
