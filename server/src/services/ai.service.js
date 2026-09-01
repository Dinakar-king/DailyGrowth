export async function aiChat(message){
 // Replace this mock with a server-side OpenAI/Gemini/etc. SDK call.
 // Never expose AI_API_KEY in React/Vite client code.
 if(process.env.AI_PROVIDER==="mock"){
  return `Coach: I received "${message}". Review your latest report, identify one weak topic, and practice 3 focused questions.`;
 }
 throw new Error("AI provider adapter not configured");
}

export async function generateQuestions({category,topic,difficulty,count=5}){
 return Array.from({length:count},(_,i)=>({
  category,topic,difficulty,
  title:`Generated ${category} question ${i+1}`,
  prompt:`Replace this mock with your AI provider. Topic: ${topic}`,
  options:["A","B","C","D"],
  answer:"A",
  explanation:"Provider-generated explanation will appear here."
 }));
}
