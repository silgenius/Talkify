export function welcomeMessage(username: string): string {
  const messages = [
    `Welcome back, ${username}!`,
    `Good to see you again, ${username}.`,
    `Hey ${username}, welcome back!`,
    `Hello again, ${username}! Ready to catch up?`,
    `Welcome back, ${username}! Your conversations await.`,
    `Back in action, ${username}! The chat’s been waiting for you.`,
    `Hey, ${username}! The conversation's just not the same without you!`,
    `Guess who’s back? ${username} is in the house!`,
    `Welcome back, ${username}! Let’s make some chat magic.`,
    `Your chat throne awaits, ${username}! Let's reignite the convo!`,
    `Missed your vibe, ${username}! Let’s get this party started.`,
    `Look who’s here! Ready to sprinkle some ${username} charm?`,
    `Back for more, ${username}? The chat room’s buzzing!`,
    `Welcome back, ${username}! Time to light up the chat!`,
    `The legend returns! What’s the plan today, ${username}?`,
  ];

  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
}
