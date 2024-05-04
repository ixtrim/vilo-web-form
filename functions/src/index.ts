import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as sgMail from '@sendgrid/mail';

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
      email: userRecord.email,
      ...otherUserData,
    });

    return { uid: userRecord.uid };
  } catch (error) {
    const message = (error as Error).message;
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

// --------------------- SendGrid E-mails usage

// Setup SendGrid
sgMail.setApiKey(functions.config().sendgrid.key);

exports.addNewUser = functions.https.onCall(async (data: any, context: functions.https.CallableContext) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }

  const { email, password, ...otherUserData } = data;
  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    await admin.firestore().collection('users').doc(userRecord.uid).set({
      email: userRecord.email,
      ...otherUserData,
    });

    return { uid: userRecord.uid };
  } catch (error) {
    const message = (error as Error).message;
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

exports.sendWelcomeEmail = functions.firestore.document('users/{userId}').onCreate(async (snap, context) => {
  const newUser = snap.data();

  const msg = {
    to: newUser.email,
    from: 'noreply@vilo.nestvested.co',
    subject: 'Your VILO Account Has Been Created!',
    text: `Dear ${newUser.full_name || 'there'}, \n\nWe are pleased to inform you that your VILO account has been successfully created. Your email address ${newUser.email || 'there'} has been registered. \n\nTo gain access to your account and start using our services, you will need to reset your password. This extra step ensures the security of your account. \n\nTo reset your password, please follow these simple steps: \n\n1. Visit our website at www.vilo.nestvested.co \n\n2. Click on the "Forgot Password" link. \n\n3. Enter your registered email address ${newUser.email || 'there'}. \n\n4. Follow the instructions provided to set a new, secure password for your account. \n\nOnce you have reset your password, you will be able to log in and explore the various features and services offered by VILO. \n\nThank you for choosing VILO.`,
    html: `Dear ${newUser.full_name || 'there'}, <br/><br/>We are pleased to inform you that your VILO account has been successfully created. Your email address ${newUser.email || 'there'} has been registered. <br/><br/>To gain access to your account and start using our services, you will need to reset your password. This extra step ensures the security of your account. <br/><br/>To reset your password, please follow these simple steps: <br/>1. Visit our website at <a href="https://www.vilo.nestvested.co/" target="_blank">www.vilo.nestvested.co</a><br/>2. Click on the "Forgot Password" link. <br/>3. Enter your registered email address ${newUser.email || 'there'}. <br/>4. Follow the instructions provided to set a new, secure password for your account. <br/><br/>Once you have reset your password, you will be able to log in and explore the various features and services offered by VILO. <br/><br/>Thank you for choosing VILO.`,
  };

  try {
    await sgMail.send(msg);
    console.log('Welcome email sent successfully');
  } catch (error) {
    console.error('Failed to send welcome email:', error);
  }
});

exports.sendCustomNotification = functions.https.onCall(async (data, context) => {
  // Verify that the user is authenticated
  if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }

  // Extract email, status, and notes from the request data
  const { email, status, notes } = data;

  // Ensure all necessary data is present
  if (!email || !status || !notes) {
      throw new functions.https.HttpsError('invalid-argument', 'The function must be called with email, status, and notes arguments.');
  }

  const msg = {
      to: email,
      from: 'noreply@yourdomain.com', // This should be the email address verified with SendGrid
      subject: `Notification: ${status}`,
      text: `Status: ${status}\nNotes: ${notes}`,
      html: `<strong>Status:</strong> ${status}<br><strong>Notes:</strong> ${notes}`
  };

  try {
      await sgMail.send(msg);
      return { result: "Email sent successfully" };
  } catch (error) {
      console.error('Error sending email:', error);
      throw new functions.https.HttpsError('internal', 'Unable to send email.');
  }
});
