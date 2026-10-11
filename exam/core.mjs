export const VERSION='chengkao-v2-20261011';
export function answered(q,a){return q.options.length?Number.isInteger(a)&&a>=0&&a<q.options.length:typeof a==='string'&&a.trim().length>0;}
export function grade(questions,answers){
 const objective=questions.filter(q=>q.options.length), subjective=questions.filter(q=>!q.options.length);
 const correct=objective.filter(q=>answered(q,answers[q.id])&&answers[q.id]===q.correct).length;
 return {objective:objective.length,correct,wrong:objective.filter(q=>answered(q,answers[q.id])&&answers[q.id]!==q.correct).length,blank:objective.filter(q=>!answered(q,answers[q.id])).length,subjective:subjective.length,subjectiveAnswered:subjective.filter(q=>answered(q,answers[q.id])).length,percent:objective.length?Math.round(correct/objective.length*100):null};
}
export function answerLabel(q,a){return answered(q,a)?(q.options.length?`${String.fromCharCode(65+a)}. ${q.options[a]}`:a):'【未作答】';}
export function exportText(attempt,bank){
 const questions=attempt.ids.map(id=>bank.find(q=>q.id===id)),g=grade(questions,attempt.answers);
 const lines=['成人高考练习答卷｜请老师批阅',`答卷编号：${attempt.id}`,`练习名称：${attempt.title}`,`题库版本：${VERSION}`,`作答人：${attempt.name||'未填写'}`,`开始时间：${new Date(attempt.startedAt).toLocaleString('zh-CN')}`,`提交时间：${attempt.submittedAt?new Date(attempt.submittedAt).toLocaleString('zh-CN'):'草稿（未提交）'}`,`实际用时：${Math.floor((attempt.elapsed||0)/60)}分${(attempt.elapsed||0)%60}秒`, '性质：原创基础训练，不是历年真题或正式全真试卷。',`客观题：${g.correct}/${g.objective}题正确，错${g.wrong}题，未答${g.blank}题；每题1分。`,`主观题：已答${g.subjectiveAnswered}/${g.subjective}题，待人工批阅，不计入客观题分数。`,'批阅请求：请检查客观题错因，逐题评阅阅读简答与作文，给出修改建议及后续练习。作文如估分，请注明是训练估分，不能换算为正式考试总分。',''];
 for(const q of questions){lines.push('────────────────',`${q.id}｜${q.subject}｜${q.section}`,q.passage?`材料：\n${q.passage}`:'',`题目：${q.prompt}`,...q.options.map((s,i)=>`${String.fromCharCode(65+i)}. ${s}`),`我的答案：\n${answerLabel(q,attempt.answers[q.id])}`);if(q.options.length)lines.push(`系统参考答案：${String.fromCharCode(65+q.correct)}. ${q.options[q.correct]}`,`系统判定：${!answered(q,attempt.answers[q.id])?'未答':attempt.answers[q.id]===q.correct?'正确':'错误'}`);else lines.push('系统判定：待老师批阅');lines.push('');}
 return lines.filter(s=>s!==null).join('\n');
}
export function validateAttempt(raw,bank){
 if(!raw||raw.version!==VERSION||!Array.isArray(raw.ids)||!raw.ids.length||raw.ids.length>99||new Set(raw.ids).size!==raw.ids.length)throw Error('答卷格式或题库版本不匹配。');
 const qs=raw.ids.map(id=>bank.find(q=>q.id===id));if(qs.some(q=>!q))throw Error('答卷包含未知题号。');
 if(!raw.answers||typeof raw.answers!=='object'||Array.isArray(raw.answers))throw Error('答卷答案格式不正确。');
 const answers={};for(const q of qs){const a=raw.answers[q.id];if(a===undefined)continue;if(q.options.length){if(!Number.isInteger(a)||a<0||a>=q.options.length)throw Error('选择题答案格式不正确。');}else if(typeof a!=='string'||a.length>20000)throw Error('文字答案格式不正确。');answers[q.id]=a;}
 if(!Number.isFinite(raw.startedAt)||!Number.isFinite(raw.elapsed)||raw.elapsed<0||raw.elapsed>31536000)throw Error('答卷时间格式不正确。');
 if(raw.submittedAt!=null&&!Number.isFinite(raw.submittedAt))throw Error('提交时间不正确。');
 return {version:VERSION,id:typeof raw.id==='string'?raw.id.slice(0,80):'import-'+Date.now(),title:String(raw.title||'导入练习').slice(0,100),name:String(raw.name||'').slice(0,40),ids:raw.ids,answers,flags:Array.isArray(raw.flags)?raw.flags.filter(id=>raw.ids.includes(id)):[],index:Number.isInteger(raw.index)?Math.max(0,Math.min(raw.index,raw.ids.length-1)):0,startedAt:raw.startedAt,elapsed:raw.elapsed,limit:Number.isFinite(raw.limit)?Math.max(0,Math.min(raw.limit,7200)):0,submittedAt:raw.submittedAt||null};
}
