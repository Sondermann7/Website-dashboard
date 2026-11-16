/** True only on the staged review build (`npm run build:review`). Never in production. */
export const REVIEW = import.meta.env.PUBLIC_REVIEW_MODE === 'true';
export const FORMS_ENABLED = import.meta.env.PUBLIC_FORMS_ENABLED === 'true';
