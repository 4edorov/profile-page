# The Resume is a hand-made PDF per Language, not generated from Profile Content

Every Page draws on Profile Content except the Resume Page, which shows a PDF the owner writes by hand (one per Language) and commits to the repo. Generating a good-looking PDF from Profile Content at build time is a project of its own, and a resume is usually tuned by hand for layout and length anyway. The accepted cost is that the Resume can drift from the Topic Pages: updating an Entry does not update the Resume.

## Considered Options

- **An HTML Resume Page built from Profile Content, print-styled for "Save as PDF"**: rejected in favour of showing the actual Resume in a PDF viewer, so what visitors see is exactly the file recruiters get.
- **A PDF generated from Profile Content at build time**: rejected for the effort it takes to make it look good, and the loss of hand-tuned layout.

## Consequences

- Changing an Entry means checking whether the Resume in every Language needs the same change.
- One Resume per Language, so the Resume Page in each Language shows its own, and both must exist.
