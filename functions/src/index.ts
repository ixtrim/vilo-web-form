import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

exports.addNewUser = functions.https.onCall(async (data: any, context: functions.https.CallableContext) => {
  // Check if request is made by an authenticated user
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }

  const { email, password, ...otherUserData } = data;
  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });
    
    // Add other user data to Firestore
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      email: userRecord.email, // Ensure email is included
      ...otherUserData,
    });

    return { uid: userRecord.uid };
  } catch (error) {
    const message = (error as Error).message; // Type assertion
    throw new functions.https.HttpsError('internal', message);
  }
});

exports.syncUserEmail = functions.firestore.document('users/{userId}').onUpdate(async (change) => {
  const beforeEmail = change.before.data().email;
  const afterEmail = change.after.data().email;
  
  if (beforeEmail !== afterEmail) {
    const userRef = admin.firestore().collection('users').doc(change.after.id);
    await userRef.update({
      email: afterEmail,
    });
  }
});