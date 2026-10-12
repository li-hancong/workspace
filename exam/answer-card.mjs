export function groupAnswerCard(questions){
 const subjects=[];
 questions.forEach((question,index)=>{
  let subject=subjects.find(item=>item.subject===question.subject);
  if(!subject){subject={subject:question.subject,groups:[]};subjects.push(subject);}
  const type=question.cardType||(question.options.length?'单选题':'简答题');
  let group=subject.groups.find(item=>item.type===type);
  if(!group){group={type,items:[]};subject.groups.push(group);}
  group.items.push({question,index});
 });
 return subjects;
}
