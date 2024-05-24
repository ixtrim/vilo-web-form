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

// --------------------- Delete user from authentication and Firestore

exports.deleteUser = functions.https.onCall(async (data: any, context: functions.https.CallableContext) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }

  const { userId } = data;

  try {
    // Delete user from Firebase Authentication
    await admin.auth().deleteUser(userId);

    // Delete user document from Firestore
    await admin.firestore().collection('users').doc(userId).delete();

    return { result: 'User deleted successfully' };
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new functions.https.HttpsError('internal', 'Unable to delete user.');
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
    text: `Dear ${newUser.full_name || 'there'}, \n\nWe are pleased to inform you that your VILO account has been successfully created. Your email address ${newUser.email || 'there'} has been registered. \n\nTo gain access to your account and start using our services, you will need to reset your password. This extra step ensures the security of your account. \n\nTo reset your password, please follow these simple steps: \n\n1. Visit our website at vilo.nestvested.co \n\n2. Click on the "Forgot Password" link. \n\n3. Enter your registered email address ${newUser.email || 'there'}. \n\n4. Follow the instructions provided to set a new, secure password for your account. \n\nOnce you have reset your password, you will be able to log in and explore the various features and services offered by VILO. \n\nThank you for choosing VILO.`,
    html: `Dear ${newUser.full_name || 'there'}, <br/><br/>We are pleased to inform you that your VILO account has been successfully created. Your email address ${newUser.email || 'there'} has been registered. <br/><br/>To gain access to your account and start using our services, you will need to reset your password. This extra step ensures the security of your account. <br/><br/>To reset your password, please follow these simple steps: <br/>1. Visit our website at <a href="https://vilo.nestvested.co/" target="_blank">vilo.nestvested.co</a><br/>2. Click on the "Forgot Password" link. <br/>3. Enter your registered email address ${newUser.email || 'there'}. <br/>4. Follow the instructions provided to set a new, secure password for your account. <br/><br/>Once you have reset your password, you will be able to log in and explore the various features and services offered by VILO. <br/><br/>Thank you for choosing VILO.`,
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

  // Extract case, email, status, and notes from the request data
  const { case_title, email, status, notes } = data;

  // Ensure all necessary data is present
  if (!case_title || !email || !status || !notes) {
      throw new functions.https.HttpsError('invalid-argument', 'The function must be called with case_title, email, status, and notes arguments.');
  }

  const msg = {
      to: email,
      from: 'noreply@vilo.nestvested.co',
      subject: `${case_title} case notification: ${status}`,
      text: `Case: ${case_title}\nStatus: ${status}\nNotes: ${notes}`,
      html: `<strong>Case:</strong> ${case_title}<br><strong>Status:</strong> ${status}<br><strong>Notes:</strong> ${notes}`
  };

  try {
      await sgMail.send(msg);
      return { result: "Email sent successfully" };
  } catch (error) {
      console.error('Error sending email:', error);
      throw new functions.https.HttpsError('internal', 'Unable to send email.');
  }
});

// --------------------- Task Notifications

exports.sendNewTaskEmail = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }

  const { taskTitle, assigneeId, reporterId, caseId } = data;

  try {
    // Fetch assignee and reporter details
    const assigneeRef = admin.firestore().collection('users').doc(assigneeId);
    const assigneeSnap = await assigneeRef.get();
    const assigneeEmail = assigneeSnap.data()?.email;
    const assigneeName = assigneeSnap.data()?.full_name;

    const reporterRef = admin.firestore().collection('users').doc(reporterId);
    const reporterSnap = await reporterRef.get();
    const reporterEmail = reporterSnap.data()?.email;
    const reporterName = reporterSnap.data()?.full_name;

    const caseRef = admin.firestore().collection('cases').doc(caseId);
    const caseSnap = await caseRef.get();
    const caseNumber = caseSnap.id;
    const caseTitle = caseSnap.data()?.title;

    if (!assigneeEmail || !caseNumber || !caseTitle) {
      throw new functions.https.HttpsError('not-found', 'User or Case details not found');
    }

    // Compose email content
    const msg = {
      to: assigneeEmail,
      from: 'noreply@vilo.nestvested.co',
      subject: `New Task Assigned: ${taskTitle}`,
      text: `Dear ${assigneeName},\n\nA new task titled "${taskTitle}" has been created by ${reporterName} and assigned to you as part of Case ${caseTitle}. Please review the task details below and begin action as required.\n\nYou can view and manage the task through the following link: https://vilo.nestvested.co/case-board/${caseNumber} \n\nPlease ensure to update the task status as you progress. Contact ${reporterName} at ${reporterEmail} if you have any questions or require further information.\n\nThank you for your attention to this task.\n\nBest regards,\nVILO Team`,
      html: `<p>Dear ${assigneeName},</p><p>A new task titled "<strong>${taskTitle}</strong>" has been created by ${reporterName} and assigned to you as part of Case <strong>${caseTitle}</strong>. Please review the task details below and begin action as required.</p><p>You can view and manage the task through the following link: <a href="https://vilo.nestvested.co/case-board/${caseNumber}">https://vilo.nestvested.co/case-board/${caseNumber}</a>.</p><p>Please ensure to update the task status as you progress. Contact ${reporterName} at ${reporterEmail} if you have any questions or require further information.</p><p>Thank you for your attention to this task.</p><p>Best regards,<br>VILO Team</p>`
    };

    // Send the email
    await sgMail.send(msg);
    return { result: 'Email sent successfully' };

  } catch (error) {
    console.error('Error sending new task email:', error);
    throw new functions.https.HttpsError('internal', 'Unable to send email.');
  }
});

exports.sendTaskUpdateEmail = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }

  const { taskId, taskTitle, caseId, userId } = data;

  try {
    // Fetch user and case details
    const userRef = admin.firestore().collection('users').doc(userId);
    const userSnap = await userRef.get();
    const userEmail = userSnap.data()?.email;
    const userName = userSnap.data()?.full_name;

    const caseRef = admin.firestore().collection('cases').doc(caseId);
    const caseSnap = await caseRef.get();
    const caseNumber = caseSnap.id;
    const caseTitle = caseSnap.data()?.title;

    if (!userEmail || !caseNumber || !caseTitle) {
      throw new functions.https.HttpsError('not-found', 'User or Case details not found');
    }

    // Compose email content
    const msg = {
      to: userEmail,
      from: 'noreply@vilo.nestvested.co',
      subject: `Update on Task for Case #${caseTitle}: Status Changed`,
      text: `Dear ${userName || 'Team'},\n\nPlease be informed that the status of "${taskTitle}" for Case #${caseTitle} has been updated. Details of the update are provided below for your reference.\n\nYou can view the full case and its associated tasks here: https://vilo.nestvested.co/case-board/${caseNumber} \n\nPlease review the updated information and adjust your activities accordingly. Should you have any questions or require further details, feel free to contact task reporter.\n\nThank you for your ongoing cooperation.\n\nBest regards,\nVILO Team`,
      html: `<p>Dear ${userName || 'Team'},</p><p>Please be informed that the status of "<strong>${taskTitle}</strong>" for Case #<strong>${caseTitle}</strong> has been updated. Details of the update are provided below for your reference.</p><p>You can view the full case and its associated tasks <a href="https://vilo.nestvested.co/case-board/${caseNumber}" title="${taskId}">here</a>.</p><p>Please review the updated information and adjust your activities accordingly. Should you have any questions or require further details, feel free to contact task reporter.</p><p>Thank you for your ongoing cooperation.</p><p>Best regards,<br>VILO Team</p>`
    };

    // Send the email
    await sgMail.send(msg);
    return { result: 'Email sent successfully' };

  } catch (error) {
    console.error('Error sending task update email:', error);
    throw new functions.https.HttpsError('internal', 'Unable to send email.');
  }
});