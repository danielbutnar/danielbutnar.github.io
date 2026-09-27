/**
 * The Google account that may open /admin. firestore.rules checks the same
 * address (see isOwner there); app/firebase/owner.test.ts keeps both equal.
 * The address is public anyway: the site shows it as the contact e-mail.
 */
export const OWNER_EMAIL = "daniel.butnar@gmail.com";
