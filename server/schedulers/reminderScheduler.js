const cron = require("node-cron");
const Note = require("../models/note");

cron.schedule("* * * * *", async () => {
  const now = new Date();

  const notes = await Note.find({
    reminderAt: { $lte: now },
    reminderSent: false,
  }).populate("user");

  for (const note of notes) {
    console.log(
      `Reminder: ${note.title} for ${note.user.email}`
    );

    note.reminderSent = true;
    await note.save();
  }
});