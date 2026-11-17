/** True only on the staged review build (`npm run build:review`). Never in production. */
export const REVIEW = import.meta.env.PUBLIC_REVIEW_MODE === 'true';
export const FORMS_ENABLED = import.meta.env.PUBLIC_FORMS_ENABLED === 'true';
/** Show the prayer form even while the other forms are off (needs PRAYER_TO or CONTACT_TO set on the server). */
export const PRAYER_FORM_ENABLED = import.meta.env.PUBLIC_PRAYER_FORM === 'true';
/** The shareable preview build (npm run build:preview). */
export const PREVIEW = import.meta.env.PUBLIC_STANDINS === 'true';
