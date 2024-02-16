import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

// Define a type for the user object
interface User {
  uid: string;
  email: string | null | undefined; // Allow email to be undefined as well
}

exports.listAllUsers = functions.https.onCall(async (data, context) => {
  // Checking that the user is authenticated.
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }

  const userList: User[] = [];
  try {
    // List batch of users, 1000 at a time.
    const listUsersResult = await admin.auth().listUsers();
    listUsersResult.users.forEach((userRecord) => {
      userList.push({ uid: userRecord.uid, email: userRecord.email || null }); // Convert undefined to null
    });
    return { users: userList };
  } catch (error) {
    throw new functions.https.HttpsError('unknown', 'Failed to list users', error);
  }
});
