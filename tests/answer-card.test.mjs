import assert from 'node:assert/strict';
import fs from 'node:fs';
import {groupAnswerCard} from '../exam/answer-card.mjs';
const bank=JSON.parse(fs.readFileSync('exam/bank.json','utf8'));
assert(bank.every(q=>typeof q.cardType==='string'&&q.cardType.length));
const grouped=groupAnswerCard(bank);
assert.deepEqual(grouped.map(s=>s.subject),['语文','数学','英语']);
const items=grouped.flatMap(s=>s.groups.flatMap(g=>g.items));
assert.equal(items.length,bank.length);
assert.equal(new Set(items.map(item=>item.index)).size,bank.length);
for(const item of items)assert.equal(bank[item.index],item.question);
for(const subject of grouped)for(const group of subject.groups){
 assert(group.items.every(item=>item.question.subject===subject.subject&&item.question.cardType===group.type));
}
const chinese=grouped.find(s=>s.subject==='语文');
assert.deepEqual(Object.fromEntries(chinese.groups.map(g=>[g.type,g.items.length])),{
 '基础选择题':14,'阅读选择题':4,'现代文阅读简答':4,'文言文阅读简答':3,'诗歌鉴赏':2,'作文':2
});
const english=grouped.find(s=>s.subject==='英语');
assert.deepEqual(Object.fromEntries(english.groups.map(g=>[g.type,g.items.length])),{
 '词汇与语法':21,'语音知识':4,'阅读理解':5,'完形填空':5,'补全对话':3,'书面表达':2
});
assert.equal(grouped.find(s=>s.subject==='数学').groups.length,1);
assert.equal(grouped.find(s=>s.subject==='数学').groups[0].items.length,30);
assert.deepEqual(groupAnswerCard([bank.find(q=>q.id==='CW1')])[0].groups.map(g=>g.type),['作文']);
assert.deepEqual(groupAnswerCard([bank.find(q=>q.id==='EW1')])[0].groups.map(g=>g.type),['书面表达']);
assert.deepEqual(groupAnswerCard([]),[]);
const selection=bank.filter(q=>['C1','C7','C11','M1','E26'].includes(q.id));
for(const item of groupAnswerCard(selection).flatMap(s=>s.groups.flatMap(g=>g.items)))assert.equal(item.question,selection[item.index]);
console.log('PASS: all 99 questions partitioned once; real question-type counts; original jump indices; mixed and writing sets.');
