export function getConversationMessage(user?: any, history?: any[]) {

  const userName = user?.name ?? "there";

  const now = new Date();

  const month = now.getMonth();
  const day = now.getDate();


  // Nigerian public holidays

  if (month === 0 && day === 1) {
    return `Happy New Year ${userName}. What can I help you draft today?`;
  }


  if (month === 4 && day === 1) {
    return `Happy Workers' Day ${userName}. Let's work on a draft today.`;
  }


  if (month === 5 && day === 12) {
    return `Happy Democracy Day ${userName}. What legal document can I help you prepare today?`;
  }


  if (month === 9 && day === 1) {
    return `Happy Independence Day ${userName}. How can cDRAFT AI assist with your legal drafting today?`;
  }
  
  // Account based greetings

  const latestDraft = history[0];
  
  if (user?.plan === "PRO") {
    if (latestDraft?.template?.title) {
  
      return `Welcome back ${userName}. I noticed your recent ${latestDraft.template.title}. Your cDRAFT AI Premium assistant is ready to help.`;
    }
    
    return `Welcome back ${userName}. Your cDRAFT AI premium assistant is ready to help with your legal drafting today.`;
  }
  
  
  if ((user?.credits ?? 0) <= 2) {
    return `Welcome back ${userName}. You have ${user.credits} credits remaining. What legal document can I help you prepare today?`;
  }
  
  
  if (!user?.everSubscribed) {
    if (latestDraft?.template?.title) {
      return `Welcome back ${userName}. I noticed your recent ${latestDraft.template.title}. What would you like to draft today?`;
    }
    
    return `Welcome ${userName}. cDRAFT AI is ready to help you create professional legal documents.`;
  }

  // Normal greetings

  const hour = now.getHours();


  const morningMessages = [
    `Good morning ${userName}. What can I help you draft today?`,
    `Good morning ${userName}. Ready to prepare your next legal document?`,
    `Good morning ${userName}. What legal matter can I assist you with today?`,
  ];
  
  
  const afternoonMessages = [
    `Good afternoon ${userName}. What can I help you draft today?`,
    `Good afternoon ${userName}. Let's work on your legal document.`,
    `Good afternoon ${userName}. How can cDRAFT AI assist you today?`,
  ];
  
  
  const eveningMessages = [
    `Good evening ${userName}. What can I help you draft today?`,
    `Good evening ${userName}. Let's prepare your legal document.`,
    `Good evening ${userName}. What legal document would you like to create?`,
  ];
  
  
  function randomMessage(messages: string[]) {
    return messages[
      Math.floor(Math.random() * messages.length)
    ];
  }
  
  
  if (hour < 12) {
    return randomMessage(morningMessages);
  }
  
  
  if (hour < 17) {
    return randomMessage(afternoonMessages);
  }
  
  
  return randomMessage(eveningMessages);
  
}
