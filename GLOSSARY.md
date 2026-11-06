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
One item of Experience, Projects or Learning (a job, a project, a course), written once per Language. A Projects Entry has its Project Kind, a name, a summary and its Tools, and optionally a Live Site, a Source and Screenshots, but no detail; a Learning Entry has its Learning Kind, its provider and optionally a summary, a Period and a Credential, and a Book its Rating, but no detail; an Experience Entry has its Assignments instead. Every Entry except a Hidden Entry appears on its Topic Page; only Featured Entries appear in its Topic's Section: a Projects or Learning one as on its Topic Page, an Experience one by its role, organisation, Location, Period and every one of its Assignments by name, description and Tools alone.
_Avoid_: Item, record, card

**Featured Entry**:
An Entry the owner has chosen to show in its Topic's Section on the Home Page, in the same order as on its Topic Page. Never a Hidden Entry, and never a Study Project.
_Avoid_: Highlight, pinned, top entry, latest entries

**Hidden Entry**:
An Entry the owner keeps in Profile Content but shows on no Page: neither its Topic's Section nor its Topic Page. Still written in full in every Language, and hidden in all of them alike. Hidden from visitors, not secret.
_Avoid_: Draft, archived, private

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

**Experience**:
The Topic covering the jobs the owner has held, one Entry per role at an organisation: its role, its organisation (optionally linked to the organisation's website), its Location, its Period and its Assignments. A promotion starts a new Entry.
_Avoid_: Jobs, work history, career, employment

**Assignment**:
A body of work the owner did within one Experience Entry, such as a product or a client project; every Experience Entry has at least one, in the order the owner writes them. It has a name, a one-line description, the owner's responsibilities on it (at least one), their achievements, the make-up of the team it was done with (such as "3 frontend developers"), and its Tools. Its responsibilities, achievements and team show only on the Experience Topic Page. Written per Language. Has no Period and is never featured or hidden on its own; one that ran across a promotion appears under each Entry it spans. Never a Projects Entry: the Projects Topic doesn't list the owner's work for their employers.
_Avoid_: Project (within a job), engagement, job project

**Tools**:
The languages, frameworks and services used on an Assignment or a Projects Entry, as the owner words them per Language. Separate from the Technologies: a Tool need not be one of them, and the two may overlap.
_Avoid_: Stack, Technologies, tech stack (for an Assignment's list)

**Location**:
Where an Experience Entry's job was done, as the owner words it per Language: a city, a country, or remote.
_Avoid_: Region, place, address

**Projects**:
The Topic covering what the owner has built outside their jobs, one Entry per project. Its Topic Page groups its Entries by Project Kind, in Project Kind order, each group in the order the owner writes them; a Project Kind with no shown Entries has no group. Its Section shows its Featured Entries, all of them Products.
_Avoid_: Portfolio, pet projects, work

**Project Kind**:
One of Product and Study Project, in that order. Every Projects Entry is of exactly one. A Product is built to be used, by the owner or by a client outside any employment; a Study Project is built mainly to learn, such as a course capstone.
_Avoid_: Category, type, work project, learning project

**Live Site**:
The link to where a Projects Entry runs, if it has one, shown as a link icon right after the Entry's name and opening in a new tab. Identical in every Language.
_Avoid_: Demo, URL, project link

**Source**:
The link to a Projects Entry's source code, if it is public. Identical in every Language. An Entry may have a Source, a Live Site, both or neither.
_Avoid_: Repo, GitHub link, code link

**Screenshot**:
An image of a Projects Entry, which may have none or several, in the order the owner chooses: the same images in every Language, each described per Language for screen readers, and shown in the Entry's Screenshot Carousel.
_Avoid_: Image, picture, preview, gallery

**Learning**:
The Topic covering what the owner has studied or is studying: education, courses, certifications and books. Each Learning Entry has a title and a provider: whoever offered it, such as an institution, a platform, an issuer or an author. Its Topic Page groups its Entries by Learning Kind, in Learning Kind order, each group in the order the owner writes them; a Learning Kind with no shown Entries has no group. Its Section groups its Featured Entries the same way.
_Avoid_: Education (for the whole Topic), studies

**Learning Kind**:
One of Education, Course, Certification and Book, in that order, each shown by its own decorative icon before the title of every Entry of that kind. Every Learning Entry is of exactly one. A program that ends in the certification it is named after is a Certification, not a Course.
_Avoid_: Category, type, group

**Rating**:
A Book's average score on Goodreads, out of 5 to one decimal, linking to that Book's Goodreads page in a new tab. Every Book has one and no other Learning Entry does. Copied by hand, so a snapshot that the owner refreshes when they choose. Identical in every Language. Not the owner's own opinion of the Book.
_Avoid_: Score, stars, review

**Credential**:
The link to the certificate or diploma a Learning Entry earned, if it has one, written per Language, shown as a link icon right after the Entry's title, before its provider, and opening in a new tab. Any Learning Kind may have one; a Certification is itself a Learning Entry, not a Credential.
_Avoid_: Certificate link, proof, certificate (for the link)

**Contact**:
The Topic listing the ways to reach the owner, each one a link (email among them), and saying whether the owner is Open to Work.
_Avoid_: Links, socials

**Open to Work**:
Whether the owner is currently looking for work, set by the owner in Profile Content. While true, the Contact Section says so beside a green light; while false, it says nothing about it. The light is purely visual.
_Avoid_: Availability, status, hiring

**Technologies**:
Every language and technology the owner has worked with, one per item, as part of the About Topic, each optionally linked to its own website. Shown in the About Section by the Technology Cloud on wider screens and the Technology Marquee on phone-sized ones, and nowhere else. Identical in every Language.
_Avoid_: Skills, tech, tags

**Stack**:
The few Technologies the owner leads with, shown under the headline in the About Section. Every Stack item is one of the Technologies. Identical in every Language.
_Avoid_: Skills, tech, tags

**Introduction**:
The owner's professional introduction, part of the About Topic: a few paragraphs on their experience, stack and way of working, written per Language and shown on the About Page under the heading "About Me".
_Avoid_: About Me (as a name), overview, profile

**Bio**:
The owner's personal story of how they came to software engineering, part of the About Topic, written per Language and shown on the About Page.
_Avoid_: Biography, story, background

**Portrait**:
The owner's photo, part of the About Topic: one image for every Language, described per Language for screen readers, and shown on the About Page.
_Avoid_: Photo, avatar, headshot, picture

**Period**:
The months an Experience or Learning Entry spans: a start month, and an end month or "present" while still in progress. Every Experience Entry and every Certification has one; any other Learning Entry may have none, and then shows none. A Period that starts and ends in the same month shows as that month alone. Projects Entries have no Period. Identical in every Language.
_Avoid_: Date range, duration, dates

## Appearance

**Theme**:
How the Profile Site looks: Light or Dark. Every visit starts in Light, whatever the visitor's system setting; the visitor switches it from the Header, and the choice lasts while they move between Pages (including switching Language) but is never remembered, so a reload or new tab starts in Light again.
_Avoid_: Color scheme, mode, dark mode

**Accent**:
A run of words in the About tagline shown in the Theme's primary color, chosen by the owner per Language. Purely visual: it adds no emphasis for screen readers, and no other Profile Content has Accents.
_Avoid_: Highlight, emphasis

**Technology Cloud**:
The About Section's turning sphere of the Technologies, which the visitor's pointer steers; the sphere stops while the pointer or keyboard focus is on a Technology, which shows in the Theme's primary color, and clicking a linked one opens its website in a new tab. Still for visitors who ask for reduced motion. Shown only on screens wider than phone-sized, where it is also how screen readers and keyboard users reach the Technologies; the Technology Marquee takes its place on phone-sized screens.
_Avoid_: Tag cloud, sphere, animation block

**Technology Marquee**:
The About Section's endless row of the Technologies below its link to the About Page, moving leftward on its own in Profile Content order; on phone-sized screens it takes the Technology Cloud's place, for screen readers and keyboard users too. A touch, hover or keyboard focus pauses it, the visitor can swipe it either way, and it moves on again from where it was left shortly after release. Tapping a linked Technology opens its website in a new tab. Still for visitors who ask for reduced motion, but still swipeable.
_Avoid_: Ticker, carousel, slider, cloud (for the row)

**Timeline**:
The line joining the Experience Entries in the Experience Section and on its Topic Page, or the Certifications in the Learning Section and on its Topic Page, or the Education Entries on the Learning Topic Page alone, in their usual order, each Entry at its own evenly spaced marker with its Period beside it, if it has one; on phone-sized screens the Period sits above the Entry instead. Shows order, not elapsed time: overlapping or distant Periods are spaced alike.
_Avoid_: History, journey, career path

**Screenshot Carousel**:
The frame showing a Projects Entry's Screenshots one at a time, in the owner's order, each fitted whole into the same 16:10 frame. The visitor moves through them with previous and next buttons, by swiping, or by the dots below that mark which one is in view; it never moves on its own and doesn't wrap around. An Entry with one Screenshot shows it alone, without controls; one with none has no Screenshot Carousel. Slides instantly for visitors who ask for reduced motion.
_Avoid_: Slider, gallery, slideshow, carousel (unqualified)

**Assignment Details**:
What an Assignment's details button opens on the Experience Topic Page, over the rest of the Page: that Assignment's responsibilities, achievements and team, under its name and organisation, leaving out any that are empty. Closes on request and returns the visitor to where they were.
_Avoid_: Modal, popup, dialog (in prose)
