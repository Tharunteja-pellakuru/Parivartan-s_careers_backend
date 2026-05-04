const emailTemplates = [
  {
    stage: "Application Submission",
    status: "Completed",
    subject: "Application received — [jobTitle] at [companyName]",
    body: `Dear [candidateName],

Thank you for applying for the [jobTitle] position at [companyName].

We are pleased to confirm that your application has been successfully submitted. Our recruitment team will carefully review your profile and get back to you regarding the next steps.

Here are your application details:
• Position: [jobTitle]
• Department: [departmentName]
• Submitted on: [submittedDate]

You will hear from us soon. In the meantime, if you have any questions, feel free to reach out to us at careers@company.com.

We appreciate your interest in joining our team and wish you the very best!

Warm regards,
[recruiterName]
Talent Acquisition Team
[companyName]`
  },
  {
    stage: "Application Received",
    status: "Successfully",
    subject: "Your application has been received — [jobTitle]",
    body: `Dear [candidateName],

Great news! We have successfully received and logged your application for the [jobTitle] role at [companyName].

Your application is now in our system and has been assigned to our hiring team for review. We wanted to take a moment to acknowledge your effort and interest.

What happens next:
Our team will screen your resume and qualifications. If your profile matches our requirements, we will contact you to schedule the next round.

Thank you for your patience and interest in [companyName]. We look forward to connecting with you soon.

Best regards,
[recruiterName]
Talent Acquisition Team
[companyName]`
  },
  {
    stage: "Resume Screening",
    status: "Pending",
    subject: "Resume screening in queue — [jobTitle] | [companyName]",
    body: `Dear [candidateName],

Thank you for your patience. We wanted to let you know that your application for the [jobTitle] position is currently queued for resume screening.

Our hiring team is processing a high volume of applications. Your profile will be reviewed shortly, and we will update you as soon as the screening is complete.

We appreciate your understanding and will be in touch soon.

Best regards,
[recruiterName]
Talent Acquisition Team
[companyName]`
  },
  {
    stage: "Resume Screening",
    status: "Completed",
    subject: "Resume screening completed — [jobTitle] | [companyName]",
    body: `Dear [candidateName],

We are pleased to inform you that the resume screening stage for your application to the [jobTitle] position has been completed.

Our team has reviewed your qualifications and experience. You will receive a separate communication shortly with details on the next steps in your application process.

Thank you for your continued interest in [companyName].

Best regards,
[recruiterName]
Talent Acquisition Team
[companyName]`
  },
  {
    stage: "Resume Screening",
    status: "Hold",
    subject: "Application on hold — Resume Screening | [jobTitle]",
    body: `Dear [candidateName],

We wanted to reach out regarding your application for the [jobTitle] position at [companyName].

Your application has been placed on hold during the resume screening stage. This may be due to internal changes in our hiring timeline or position requirements. Please be assured that this is not a reflection of your qualifications.

We will revisit your profile and update you as soon as there is further clarity from our end.

We apologize for any inconvenience and thank you for your patience.

Best regards,
[recruiterName]
Talent Acquisition Team
[companyName]`
  },
  {
    stage: "Resume Screening",
    status: "In Progress",
    subject: "Your resume is being reviewed — [jobTitle] | [companyName]",
    body: `Dear [candidateName],

We wanted to keep you informed — your application for the [jobTitle] position is currently being actively reviewed by our hiring team.

Our recruiters are carefully evaluating your resume and experience. We will contact you as soon as the review is complete.

Thank you for your patience while we take the time to review your profile thoroughly.

Best regards,
[recruiterName]
Talent Acquisition Team
[companyName]`
  },
  {
    stage: "Resume Screening",
    status: "Cleared",
    subject: "Congratulations! Resume screening cleared — [jobTitle]",
    body: `Dear [candidateName],

We are delighted to inform you that you have successfully cleared the resume screening stage for the [jobTitle] position at [companyName].

Your qualifications and experience stood out, and we are excited to move you forward in the selection process. Our team will reach out shortly to schedule the next stage.

Next stage: Technical Test

Please keep an eye on your inbox for further instructions. We look forward to learning more about you!

Best regards,
[recruiterName]
Talent Acquisition Team
[companyName]`
  },
  {
    stage: "Resume Screening",
    status: "Rejected",
    subject: "Update on your application — [jobTitle] | [companyName]",
    body: `Dear [candidateName],

Thank you for your interest in the [jobTitle] position at [companyName] and for the time you invested in your application.

After a careful review of your resume during the screening stage, we regret to inform you that your profile does not meet the specific requirements we are looking for at this time.

We sincerely appreciate your effort and encourage you to apply for future openings that may be a better fit for your skills and experience.

We wish you the very best in your job search and future career endeavors.

Warm regards,
[recruiterName]
Talent Acquisition Team
[companyName]`
  },
  {
    stage: "Resume Screening",
    status: "Failed",
    subject: "Resume screening update — [jobTitle] | [companyName]",
    body: `Dear [candidateName],

We appreciate you applying for the [jobTitle] role at [companyName].

Unfortunately, your application did not meet the minimum criteria required during the resume screening phase. This decision was based solely on the specific technical and experience benchmarks set for this role.

We value your interest in our organization and encourage you to continue developing your skills. We welcome you to apply again in the future.

Thank you for considering [companyName] as your potential employer.

Best regards,
[recruiterName]
Talent Acquisition Team
[companyName]`
  },
  {
    stage: "Technical Test",
    status: "Pending",
    subject: "Technical test scheduled — Action required | [jobTitle]",
    body: `Dear [candidateName],

Congratulations on progressing to the Technical Test stage for the [jobTitle] position at [companyName]!

Your technical assessment is currently being set up and will be shared with you shortly. Please ensure your contact details are up to date so we can reach you without delay.

Please watch your inbox for further instructions. We're excited to see you in action!

Best regards,
[recruiterName]
Talent Acquisition Team
[companyName]`
  },
  {
    stage: "Technical Test",
    status: "Completed",
    subject: "Technical test submitted — Under review | [jobTitle]",
    body: `Dear [candidateName],

Thank you for completing the technical test for the [jobTitle] position at [companyName].

We have received your submission and our technical team is now evaluating your responses. You will be notified of the outcome shortly.

We appreciate the time and effort you put into the assessment.

Best regards,
[recruiterName]
Talent Acquisition Team
[companyName]`
  },
  {
    stage: "Technical Test",
    status: "Hold",
    subject: "Technical test on hold — [jobTitle] | [companyName]",
    body: `Dear [candidateName],

We are writing to let you know that your technical test for the [jobTitle] position has been temporarily placed on hold.

This may be due to internal scheduling or evaluation requirements. We assure you that your candidacy remains active and we will resume the process as soon as possible.

Thank you for your understanding and continued patience.

Best regards,
[recruiterName]
Talent Acquisition Team
[companyName]`
  },
  {
    stage: "Technical Test",
    status: "In Progress",
    subject: "Technical test under evaluation — [jobTitle] | [companyName]",
    body: `Dear [candidateName],

Thank you for completing the technical assessment for the [jobTitle] role. We wanted to let you know that your test is currently being evaluated by our technical panel.

We will get back to you with the results as soon as the review is complete.

Thank you for your patience!

Best regards,
[recruiterName]
Talent Acquisition Team
[companyName]`
  },
  {
    stage: "Technical Test",
    status: "Cleared",
    subject: "Technical test cleared! Next steps for [jobTitle]",
    body: `Dear [candidateName],

Excellent work! We are thrilled to inform you that you have successfully cleared the Technical Test stage for the [jobTitle] position at [companyName].

Your performance on the assessment was impressive and we are excited to move you to the next stage of the process.

Next stage: Technical Interview

Our team will reach out to you shortly to schedule your Technical Interview. Well done, and keep up the great work!

Best regards,
[recruiterName]
Talent Acquisition Team
[companyName]`
  },
  {
    stage: "Technical Test",
    status: "Rejected",
    subject: "Technical test outcome — [jobTitle] | [companyName]",
    body: `Dear [candidateName],

Thank you for taking the time to complete the technical assessment for the [jobTitle] position at [companyName].

After a thorough evaluation by our technical team, we regret to inform you that your performance did not meet the benchmark required to proceed to the next round.

We encourage you to continue honing your technical skills. You are welcome to reapply for this or similar roles in the future.

We sincerely appreciate your effort and wish you all the best in your career journey.

Warm regards,
[recruiterName]
Talent Acquisition Team
[companyName]`
  },
  {
    stage: "Technical Test",
    status: "Failed",
    subject: "Technical assessment result — [jobTitle] | [companyName]",
    body: `Dear [candidateName],

We appreciate the effort you put into the technical assessment for the [jobTitle] role at [companyName].

Unfortunately, the assessment results did not meet the required technical standards for this position. Our evaluation is based on specific competency benchmarks aligned to the role's requirements.

We appreciate your participation and encourage you to build on your skills. We hope to see your application again in the future.

Best wishes for your continued growth.

Best regards,
[recruiterName]
Talent Acquisition Team
[companyName]`
  },
  {
    stage: "Technical Interview",
    status: "Pending",
    subject: "Technical interview to be scheduled — [jobTitle] | [companyName]",
    body: `Dear [candidateName],

Congratulations on advancing to the Technical Interview stage for the [jobTitle] position at [companyName]!

We are currently coordinating schedules with our technical panel. You will receive an interview invite with the date, time, and format (in-person / virtual) shortly.

Please ensure your calendar is flexible. We're looking forward to speaking with you!

Best regards,
[recruiterName]
Talent Acquisition Team
[companyName]`
  },
  {
    stage: "Technical Interview",
    status: "Completed",
    subject: "Technical interview completed — Awaiting feedback | [jobTitle]",
    body: `Dear [candidateName],

Thank you for attending the Technical Interview for the [jobTitle] position at [companyName].

We appreciate the time you invested and found our conversation very insightful. Our technical panel is currently reviewing their feedback and we will inform you of the next steps shortly.

Thank you for your patience and continued interest in joining [companyName].

Best regards,
[recruiterName]
Talent Acquisition Team
[companyName]`
  },
  {
    stage: "Technical Interview",
    status: "Hold",
    subject: "Technical interview on hold — [jobTitle] | [companyName]",
    body: `Dear [candidateName],

We are reaching out to inform you that your Technical Interview for the [jobTitle] position has been temporarily placed on hold.

This is due to internal scheduling adjustments on our end. Your application remains active and we will resume the process and update you as soon as possible.

We sincerely apologize for any inconvenience this may cause and appreciate your understanding.

Best regards,
[recruiterName]
Talent Acquisition Team
[companyName]`
  },
  {
    stage: "Technical Interview",
    status: "In Progress",
    subject: "Technical interview feedback being compiled — [jobTitle] | [companyName]",
    body: `Dear [candidateName],

Just a quick note to let you know that your Technical Interview stage is currently in progress. Our panel is in the process of consolidating their feedback from your interview.

We will share the outcome with you as soon as their review is finalized.

Thank you for your patience!

Best regards,
[recruiterName]
Talent Acquisition Team
[companyName]`
  },
  {
    stage: "Technical Interview",
    status: "Cleared",
    subject: "Technical interview cleared! Advancing to Managerial Round",
    body: `Dear [candidateName],

Fantastic news! You have successfully cleared the Technical Interview for the [jobTitle] position at [companyName].

Our technical panel was impressed with your depth of knowledge and problem-solving approach. We are happy to inform you that you are advancing to the next stage of the process.

Next stage: Managerial Round

Our team will reach out shortly to schedule your next interview. Congratulations and keep up the excellent work!

Best regards,
[recruiterName]
Talent Acquisition Team
[companyName]`
  },
  {
    stage: "Technical Interview",
    status: "Rejected",
    subject: "Update on your technical interview — [jobTitle] | [companyName]",
    body: `Dear [candidateName],

Thank you for your time and effort during the Technical Interview for the [jobTitle] position at [companyName].

After careful deliberation by our technical panel, we regret to inform you that we will not be moving forward with your application at this stage. This was a difficult decision given the competitive pool of candidates.

We truly appreciate your enthusiasm and encourage you to apply for future opportunities with us.

Wishing you the very best in your career.

Warm regards,
[recruiterName]
Talent Acquisition Team
[companyName]`
  },
  {
    stage: "Technical Interview",
    status: "Failed",
    subject: "Technical interview outcome — [jobTitle] | [companyName]",
    body: `Dear [candidateName],

Thank you for participating in the Technical Interview for the [jobTitle] role at [companyName].

We regret to inform you that your performance in the interview did not meet the required standards for this position. Our evaluation is based on technical depth, problem-solving approach, and role-specific competencies.

We appreciate your participation and encourage you to continue building your expertise. We look forward to potentially seeing your application again in the future.

All the best in your endeavors.

Best regards,
[recruiterName]
Talent Acquisition Team
[companyName]`
  },
  {
    stage: "Managerial Round",
    status: "Pending",
    subject: "Managerial interview to be scheduled — [jobTitle] | [companyName]",
    body: `Dear [candidateName],

Congratulations on reaching the Managerial Round for the [jobTitle] position at [companyName]!

We are currently arranging the interview with the relevant manager. You will receive the interview invite with full details shortly.

We look forward to this next conversation with you. Well done so far!

Best regards,
[recruiterName]
Talent Acquisition Team
[companyName]`
  },
  {
    stage: "Managerial Round",
    status: "Completed",
    subject: "Managerial round completed — [jobTitle] | [companyName]",
    body: `Dear [candidateName],

Thank you for attending the Managerial Round interview for the [jobTitle] position at [companyName].

Our hiring manager found the discussion very productive. Feedback is being compiled and we will be in touch shortly with the outcome and next steps.

Thank you for your time and continued interest in [companyName].

Best regards,
[recruiterName]
Talent Acquisition Team
[companyName]`
  },
  {
    stage: "Managerial Round",
    status: "Hold",
    subject: "Managerial round on hold — [jobTitle] | [companyName]",
    body: `Dear [candidateName],

We wanted to keep you informed that your Managerial Round interview for the [jobTitle] position has been placed on hold temporarily.

This is due to the hiring manager's availability or internal planning requirements. We will resume the scheduling process shortly and inform you of the new date.

We appreciate your understanding and flexibility.

Best regards,
[recruiterName]
Talent Acquisition Team
[companyName]`
  },
  {
    stage: "Managerial Round",
    status: "In Progress",
    subject: "Managerial round feedback being compiled — [jobTitle]",
    body: `Dear [candidateName],

A quick update — your Managerial Round interview is currently in the evaluation phase. The hiring manager is reviewing their notes and preparing feedback.

We will share the outcome with you as soon as it is available.

Thank you for your patience!

Best regards,
[recruiterName]
Talent Acquisition Team
[companyName]`
  },
  {
    stage: "Managerial Round",
    status: "Cleared",
    subject: "Managerial round cleared! Moving to HR Final Round",
    body: `Dear [candidateName],

Wonderful news! You have cleared the Managerial Round for the [jobTitle] position at [companyName].

The hiring manager was impressed with your leadership perspective and alignment with the team's goals. You are now advancing to the final stage of our process.

Next stage: HR Final Round

Our HR team will be in touch shortly to schedule the final discussion. Congratulations and best of luck!

Best regards,
[recruiterName]
Talent Acquisition Team
[companyName]`
  },
  {
    stage: "Managerial Round",
    status: "Rejected",
    subject: "Update on your application — Managerial Round | [jobTitle]",
    body: `Dear [candidateName],

Thank you for your time and engagement during the Managerial Round interview for the [jobTitle] position at [companyName].

After thoughtful consideration, the hiring manager has decided not to proceed with your application at this stage. This was a tough call given the high quality of candidates in our process.

We genuinely value your interest in [companyName] and encourage you to apply for suitable openings in the future.

We wish you all the best.

Warm regards,
[recruiterName]
Talent Acquisition Team
[companyName]`
  },
  {
    stage: "Managerial Round",
    status: "Failed",
    subject: "Managerial round outcome — [jobTitle] | [companyName]",
    body: `Dear [candidateName],

Thank you for your participation in the Managerial Round for the [jobTitle] role at [companyName].

Unfortunately, after evaluation, we are unable to move your application forward at this stage. The decision was based on our assessment of overall fit with the team and role requirements at this time.

We encourage you to continue growing professionally and welcome future applications.

Wishing you great success ahead.

Best regards,
[recruiterName]
Talent Acquisition Team
[companyName]`
  },
  {
    stage: "HR Final Round",
    status: "Pending",
    subject: "HR Final Round to be scheduled — [jobTitle] | [companyName]",
    body: `Dear [candidateName],

Congratulations! You have made it to the HR Final Round for the [jobTitle] position at [companyName] — this is a significant milestone!

Our HR team is currently coordinating the schedule. You will receive an invite with all details shortly.

You are almost there! We look forward to our final conversation.

Best regards,
[recruiterName]
Talent Acquisition Team
[companyName]`
  },
  {
    stage: "HR Final Round",
    status: "Completed",
    subject: "HR Final Round completed — [jobTitle] | [companyName]",
    body: `Dear [candidateName],

Thank you for completing the HR Final Round interview for the [jobTitle] position at [companyName].

It was a pleasure speaking with you and learning more about your career aspirations. Our HR team is now reviewing the discussion and will reach out to you with the next steps very shortly.

We truly appreciate your time and enthusiasm.

Best regards,
[recruiterName]
Talent Acquisition Team
[companyName]`
  },
  {
    stage: "HR Final Round",
    status: "Hold",
    subject: "HR Final Round on hold — [jobTitle] | [companyName]",
    body: `Dear [candidateName],

We wanted to keep you in the loop — your HR Final Round for the [jobTitle] position has been briefly placed on hold due to internal scheduling.

We assure you this is not a reflection of your candidacy, which remains very strong. We will reschedule and notify you promptly.

Thank you for your patience and understanding.

Best regards,
[recruiterName]
Talent Acquisition Team
[companyName]`
  },
  {
    stage: "HR Final Round",
    status: "In Progress",
    subject: "HR Final Round under review — [jobTitle] | [companyName]",
    body: `Dear [candidateName],

A quick update — your HR Final Round interview is currently being reviewed internally. Our HR leadership team is consolidating their feedback.

We will be in touch very soon with the outcome.

Thank you for your continued patience!

Best regards,
[recruiterName]
Talent Acquisition Team
[companyName]`
  },
  {
    stage: "HR Final Round",
    status: "Cleared",
    subject: "HR Final Round cleared! Exciting news ahead — [jobTitle]",
    body: `Dear [candidateName],

Congratulations! You have successfully cleared the HR Final Round for the [jobTitle] position at [companyName]!

This is a wonderful achievement. You have impressed us throughout the entire selection process. Our team is now working on the next steps, which include preparing your offer details.

Next stage: Offer Preparation

Please stay tuned — we will be in touch very soon with more exciting details. Well done!

Best regards,
[recruiterName]
Talent Acquisition Team
[companyName]`
  },
  {
    stage: "HR Final Round",
    status: "Rejected",
    subject: "Update on your application — HR Final Round | [jobTitle]",
    body: `Dear [candidateName],

Thank you for your time and the genuine interest you demonstrated throughout our hiring process for the [jobTitle] position at [companyName].

After the HR Final Round discussion, we have made the difficult decision not to proceed with your application. This was a very close call and does not diminish your achievements through the earlier rounds.

We would love to keep your profile on file for future opportunities that may be an even better fit.

We sincerely wish you every success in your career journey.

Warm regards,
[recruiterName]
Talent Acquisition Team
[companyName]`
  },
  {
    stage: "HR Final Round",
    status: "Failed",
    subject: "HR Final Round outcome — [jobTitle] | [companyName]",
    body: `Dear [candidateName],

Thank you for participating in the HR Final Round for the [jobTitle] role at [companyName].

After careful deliberation, we are unable to proceed with your application at this stage. We base these decisions on overall alignment with our organizational culture and long-term team needs.

We appreciate everything you brought to this process and encourage you to apply again in the future.

Best wishes for your future career goals.

Best regards,
[recruiterName]
Talent Acquisition Team
[companyName]`
  },
  {
    stage: "Offer Preparation",
    status: "Pending",
    subject: "Offer being prepared — [jobTitle] | [companyName]",
    body: `Dear [candidateName],

Exciting news! You have successfully completed all interview rounds for the [jobTitle] position at [companyName].

We are delighted to inform you that our team has initiated the offer preparation process for you. You will receive the official offer letter shortly once all internal approvals are in place.

Please feel free to reach out if you have any queries in the meantime.

Best regards,
[recruiterName]
Talent Acquisition Team
[companyName]`
  },
  {
    stage: "Offer Preparation",
    status: "Completed",
    subject: "Offer preparation complete — Offer letter on the way!",
    body: `Dear [candidateName],

We are pleased to inform you that the offer preparation for the [jobTitle] position has been completed.

Your offer letter is ready and will be officially shared with you via the next communication. Please be on the lookout for an email titled "Offer Letter — [jobTitle] at [companyName]."

We are very excited about having you on board!

Best regards,
[recruiterName]
Talent Acquisition Team
[companyName]`
  },
  {
    stage: "Offer Preparation",
    status: "Hold",
    subject: "Offer preparation on hold — [jobTitle] | [companyName]",
    body: `Dear [candidateName],

We wanted to reach out and keep you informed — the offer preparation for the [jobTitle] position has been temporarily placed on hold.

This may be due to an internal approval process or budget review. Please be assured that your selection remains confirmed and this is purely an administrative step.

We sincerely apologize for the delay and appreciate your understanding.

Best regards,
[recruiterName]
Talent Acquisition Team
[companyName]`
  },
  {
    stage: "Offer Preparation",
    status: "In Progress",
    subject: "Offer preparation in progress — [jobTitle] | [companyName]",
    body: `Dear [candidateName],

We are excited to let you know that your offer for the [jobTitle] position at [companyName] is currently being prepared and is going through our internal review and approval process.

You will receive your formal offer letter as soon as this is finalized.

Thank you for your patience — we're almost there!

Best regards,
[recruiterName]
Talent Acquisition Team
[companyName]`
  },
  {
    stage: "Offer Issued",
    status: "Completed",
    subject: "Official offer letter — [jobTitle] at [companyName]",
    body: `Dear [candidateName],

Congratulations! We are absolutely thrilled to extend a formal offer of employment to you for the [jobTitle] position at [companyName].

Please find your offer letter attached to this email. Below is a summary of key details:

• Position: [jobTitle]
• Department: [departmentName]
• Reporting to: [managerName]
• Start Date: [startDate]
• CTC: [compensation]
• Work Location: [workLocation]

Please review the offer letter carefully and revert with your acceptance by [acceptanceDeadline]. If you have any questions or require clarification on any aspect of the offer, please do not hesitate to reach out.

We look forward to welcoming you to the [companyName] family!

Warm regards,
[recruiterName]
Talent Acquisition Team
[companyName]`
  },
  {
    stage: "Offer Accepted",
    status: "Completed",
    subject: "Offer accepted — Welcome to [companyName]! | [jobTitle]",
    body: `Dear [candidateName],

We are absolutely delighted to confirm that we have received your signed offer letter for the [jobTitle] position at [companyName].

Welcome to the team! We are so excited to have you join us.

Here's what to expect next:
• Your official joining date: [joiningDate]
• Reporting time: [reportingTime] at [reportingLocation]
• Onboarding documents will be shared separately
• Your point of contact: [onboardingContactName] — [onboardingContactEmail]

Please watch your inbox for a pre-joining checklist and onboarding schedule. If you have any questions before your start date, don't hesitate to reach out.

Once again, congratulations and welcome aboard!

Warm regards,
[recruiterName]
Talent Acquisition Team
[companyName]`
  },
  {
    stage: "Joining",
    status: "Completed",
    subject: "Welcome to [companyName]! Your first day checklist",
    body: `Dear [candidateName],

Today is a big day — welcome officially to [companyName]!

We are thrilled to have you join us as [jobTitle] in the [departmentName] team. We hope your first day is smooth, exciting, and the start of a remarkable journey with us.

First day details:
• Date: [joiningDate]
• Reporting time: [reportingTime]
• Location: [reportingLocation]
• Your buddy: [buddyName] — [buddyContact]

What to bring:
• Government-issued photo ID
• Educational and experience documents
• Bank account details for payroll
• Emergency contact information

Your manager [managerName] and the team are eagerly looking forward to meeting you.

Here's to new beginnings!

Warm regards,
[hrTeamName]
Human Resources
[companyName]`
  },
  {
    stage: "Rejected",
    status: "Rejected",
    subject: "Your application status — [jobTitle] | [companyName]",
    body: `Dear [candidateName],

Thank you for your interest in the [jobTitle] position at [companyName] and for investing your time and effort throughout our selection process.

After thorough consideration at all stages, we regret to inform you that we are unable to move forward with your application at this time. This was not an easy decision, as we received applications from many highly talented individuals.

Please know that this decision does not diminish your skills or potential. We encourage you to continue pursuing opportunities that align with your strengths and career goals.

We would love to keep your profile in our talent pool for future openings. If you consent to this, no action is required on your part.

We sincerely appreciate your time and wish you great success in your career journey ahead.

Warm regards,
[recruiterName]
Talent Acquisition Team
[companyName]`
  }
];

export default emailTemplates;