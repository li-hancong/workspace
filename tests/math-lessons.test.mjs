import assert from 'node:assert/strict';
import fs from 'node:fs';
import {MATH_LESSONS,getMathLesson} from '../exam/math-lessons.mjs';
const bank=JSON.parse(fs.readFileSync('exam/bank.json','utf8'));
const math=bank.filter(q=>q.subject==='数学');

// A missing mapping would silently remove pre-learning from a question.
assert.equal(math.length,30);
assert.deepEqual(Object.keys(MATH_LESSONS).sort(),math.map(q=>q.id).sort());
for(const q of math){
 const l=getMathLesson(q);
 for(const key of ['title','decode','pitfall'])assert.equal(typeof l[key],'string',q.id+' '+key);
 assert(l.terms.length>=2,q.id+' glossary');
 for(const pair of l.terms)assert(pair.length===2&&pair.every(x=>typeof x==='string'&&x.trim()),q.id+' term');
 assert(l.concepts.length>=2&&l.memory.length>=2,q.id+' explanation and memory');
 assert(l.example.prompt&&l.example.steps.length===3&&l.example.conclusion,q.id+' worked example');
 const text=JSON.stringify(l);
 assert(!text.includes(q.prompt),q.id+' must use a different worked example');
 assert(!text.includes('正确答案：'),q.id+' must not include the current answer label');
 assert(!/undefined|NaN|TODO/.test(text),q.id+' unfinished text');
 assert(!('correct' in l||'answer' in l),q.id+' lesson is separate from marking');
}
for(const q of bank.filter(q=>q.subject!=='数学'))assert.equal(getMathLesson(q),null);
assert.equal(getMathLesson({id:'M999',subject:'数学'}),null);

// Independently verify that the question-bank marking still matches the
// mathematical rules being taught, including sets, boundaries and coordinates.
const fraction=(n,d)=>{const gcd=(a,b)=>b?gcd(b,a%b):a;const g=gcd(n,d);return `${n/g}/${d/g}`;};
const expected={
 M1:'{'+[1,2,3].filter(n=>[2,4].includes(n)).join(',')+'}',
 M2:'{'+[...new Set([1,3,3,5])].sort((a,b)=>a-b).join(',')+'}',
 M3:fraction(1*3+1*2,2*3),M4:String((11-2)/3),M5:'x＜−3',
 M6:'2和3',M7:String(2*2**2-1),M8:'(−∞,5]',M9:'x≥3',
 M10:String(Math.log2(8)),M11:String(2**3*2**2),M12:'y=2x',
 M13:String(3+(5-1)*2),M14:String(Array.from({length:10},(_,i)=>i+1).reduce((s,n)=>s+n,0)),
 M15:String(2*3**(4-1)),M16:'1/2',M17:'1',M18:'1',
 M19:String((6-2)/(3-1)),M20:'(2,3)',M21:String(Math.hypot(3,4)),
 M22:String(Math.sqrt(9)),M23:`(${2+1},${3-2})`,M24:String(2*1+1*(-2)),
 M25:String((8+10+12+18)/4),M26:fraction(3,3+2),M27:fraction(4*3,6*5),
 M28:String([2,4,7,8,9].sort((a,b)=>a-b)[2]),
 M29:String(6*(4+(4+(6-1)*3))/2),M30:'(4,0)'
};
for(const q of math)assert.equal(q.options[q.correct],expected[q.id],q.id+' grading');
for(const x of [-8,-3,0,2,7])assert(-((x-2)**2)+5<=5);
assert.equal(-((2-2)**2)+5,5);
assert.equal(Math.sqrt(3-3),0);
assert.equal(-2*(-4)>6,true);assert.equal(-2*(-3)>6,false);
for(const root of [2,3])assert.equal(root**2-5*root+6,0);
const close=(a,b)=>assert(Math.abs(a-b)<1e-12);
close(Math.sin(Math.PI/6),1/2);close(Math.cos(Math.PI/3),1/2);
close(Math.cos(Math.PI/3)+Math.sin(Math.PI/6),1);close(Math.tan(Math.PI/4),1);
assert.equal(2*2-1,3);assert.equal(-4+4,0);
console.log('PASS: 30 complete beginner lessons, different examples, math-only mapping, and all 30 marking answers independently checked.');
