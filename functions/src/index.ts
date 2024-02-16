import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

exports.deleteUserAndData = functions.https.onCall(async (data: { userId: string }, context: functions.https.CallableContext) => {
  // Ensure the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }

  const userId = data.userId;

  try {
    await admin.auth().deleteUser(userId);
    console.log('Successfully deleted user', userId);
    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new functions.https.HttpsError('internal', 'Error deleting user.', error);
  }
});
