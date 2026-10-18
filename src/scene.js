import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';

const host=document.querySelector('#webgl'),status=document.querySelector('#status'),back=document.querySelector('#back');
const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
const data=window.arcadeData,keys=['about','experience','projects'];
const items={about:[{name:'Meet Nishal',symbol:'N',action:'about'},{name:'Education',symbol:'UCLA',action:'education'},{name:'Off the clock',symbol:'70.3',action:'offclock'},{name:'Say hello',symbol:'@',action:'contact'}],experience:data.jobs.map((j,i)=>({name:j[0].replace('Tech4Good GenAI Lab','Tech4Good'),symbol:['VISA','C','T4G','S','CN'][i],job:i})),projects:data.projects.map((p,i)=>({name:['Ironman Intel','Compass','Fraud Lab','Attention'][i],symbol:['IM','C','F','AI'][i],project:i}))};
let renderer;
try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});}catch(e){document.querySelector('#loading').textContent='3D is unavailable in this browser. Use the portfolio links below.';document.querySelector('#accessible').classList.add('fallback');throw e;}
renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.85;renderer.outputColorSpace=THREE.SRGBColorSpace;host.append(renderer.domElement);renderer.domElement.tabIndex=0;renderer.domElement.setAttribute('aria-label','3D computer terminals. Select About Me, Experience, or Projects.');
const scene=new THREE.Scene();scene.background=new THREE.Color(0x040c19);scene.environmentIntensity=.22;scene.fog=new THREE.FogExp2(0x071525,.027);const camera=new THREE.PerspectiveCamera(38,innerWidth/innerHeight,.1,80);camera.position.set(.8,2.4,8);
const pmrem=new THREE.PMREMGenerator(renderer);const room=new RoomEnvironment();scene.environment=pmrem.fromScene(room,.04).texture;room.dispose();
const ambient=new THREE.HemisphereLight(0x4b98c7,0x080815,.65);scene.add(ambient);
function spot(color,intensity,x,y,z){const l=new THREE.SpotLight(color,intensity,25,.72,.8,1);l.position.set(x,y,z);l.target.position.set(0,1.4,0);l.castShadow=true;l.shadow.mapSize.set(1024,1024);l.shadow.bias=-.0003;l.shadow.normalBias=.03;scene.add(l,l.target);return l;}
spot(0x62cfff,48,-5,7,3);spot(0xf4427e,38,5,6,-2);spot(0x277fdb,24,-5,5,-3);const fill=new THREE.DirectionalLight(0xffb9b8,1.2);fill.position.set(0,4,7);scene.add(fill);
const roadMap=canvasTex(512,512,(c,w,h)=>{c.fillStyle='#29323e';c.fillRect(0,0,w,h);for(let i=0;i<24000;i++){const v=25+Math.random()*70;c.fillStyle=`rgb(${v},${v},${v})`;c.fillRect(Math.random()*w,Math.random()*h,1,1);}});roadMap.wrapS=roadMap.wrapT=THREE.RepeatWrapping;roadMap.repeat.set(20,20);
const floor=new THREE.Mesh(new THREE.PlaneGeometry(80,80),new THREE.MeshStandardMaterial({color:0x263949,map:roadMap,bumpMap:roadMap,bumpScale:.035,roughness:.94,metalness:0}));floor.rotation.x=-Math.PI/2;floor.position.y=-.17;floor.receiveShadow=true;scene.add(floor);
const white=new THREE.MeshPhysicalMaterial({color:0x9b102c,metalness:.32,roughness:.32,clearcoat:1,clearcoatRoughness:.16});
const dark=new THREE.MeshStandardMaterial({color:0x111626,metalness:.7,roughness:.28});const chrome=new THREE.MeshStandardMaterial({color:0x728a98,metalness:1,roughness:.23});const black=new THREE.MeshStandardMaterial({color:0x060911,metalness:.35,roughness:.45});
const glass=new THREE.MeshPhysicalMaterial({color:0xc0e8fa,metalness:0,roughness:.025,transmission:.12,transparent:true,opacity:.11,ior:1.5,thickness:.035,envMapIntensity:1.2,clearcoat:1,depthWrite:false});
function mesh(parent,geo,mat,x=0,y=0,z=0,shadow=true){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=shadow;m.receiveShadow=true;parent.add(m);return m;}
function box(parent,w,h,d,mat,x=0,y=0,z=0,r=.025){return mesh(parent,new RoundedBoxGeometry(w,h,d,2,Math.min(r,w/4,h/4,d/4)),mat,x,y,z);}
function cyl(parent,r1,r2,h,mat,x,y,z){return mesh(parent,new THREE.CylinderGeometry(r1,r2,h,24),mat,x,y,z);}
function ball(parent,r,mat,x,y,z){return mesh(parent,new THREE.SphereGeometry(r,28,20),mat,x,y,z);}
function beam(parent,a,b,r,mat){const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b),m=cyl(parent,r,r,start.distanceTo(end),mat,0,0,0);m.position.copy(start).add(end).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),end.sub(start).normalize());return m;}
function glow(color,strength=2.5){return new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:strength,roughness:.23,metalness:.2,toneMapped:false});}
const rainbow=[0x26eeff,0x4581ff,0xa863ff,0xff40c9,0xff6d58,0xffd652,0x90ff83];
function neonTube(parent,points,r=.012,offset=0){for(let i=1;i<points.length;i++)beam(parent,points[i-1],points[i],r,glow(offset===99?0x44eadb:0xf852a4,2.0));}
function outline(parent,w,h,z,x,y,r=.018,offset=0){const pts=[[-w/2,-h/2],[-w/2,h/2-.12],[-w/2+.03,h/2-.04],[-w/2+.12,h/2],[w/2-.12,h/2],[w/2-.03,h/2-.04],[w/2,h/2-.12],[w/2,-h/2],[w/2-.12,-h/2-.02],[-w/2+.12,-h/2-.02],[-w/2,-h/2]];neonTube(parent,pts.map(p=>[x+p[0],y+p[1],z]),r,offset);}
function canvasTex(w,h,paint){const c=document.createElement('canvas');c.width=w;c.height=h;paint(c.getContext('2d'),w,h);const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=renderer.capabilities.getMaxAnisotropy();return tex;}
function textTexture(text,color='#eefaff',size=68){return canvasTex(1024,192,(c,w,h)=>{c.clearRect(0,0,w,h);c.font=`600 ${size}px Arial`;c.textAlign='center';c.textBaseline='middle';c.shadowColor=color;c.shadowBlur=4;c.fillStyle=color;c.fillText(text,w/2,h/2,w-36);});}
function label(parent,text,w,h,x,y,z,color='#eefaff',size=68){const tex=textTexture(text,color,size);const m=mesh(parent,new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false,toneMapped:false}),x,y,z,false);return m;}
function graphics(seed){return canvasTex(768,1024,(c,w,h)=>{const gr=c.createLinearGradient(0,0,w,h);gr.addColorStop(0,'#450b1a');gr.addColorStop(.45,'#741327');gr.addColorStop(1,'#230913');c.fillStyle=gr;c.fillRect(0,0,w,h);for(let i=0;i<5000;i++){c.fillStyle=`rgba(180,120,140,${Math.random()*.035})`;c.fillRect(Math.random()*w,Math.random()*h,1,Math.random()*12);}c.strokeStyle='#210914';c.lineWidth=3;c.strokeRect(25,25,w-50,h-50);});}
const models=[],clickables=[];
function tag(obj,info){obj.traverse(o=>{if(o.isMesh){o.userData.action={...info,model:info.model.key};clickables.push(o);}});return obj;}
function makeMachine(key,index){const m={key,index,x:(index-1)*2.35};const g=new THREE.Group();g.position.x=m.x;g.rotation.y=index===0?.07:index===2?-.07:0;scene.add(g);m.group=g;
const print=new THREE.MeshStandardMaterial({map:graphics(index),metalness:.35,roughness:.3});
// Solid computer terminal housing with inset display and a machined control shelf.
box(g,1.9,3.28,1.15,white,0,1.72,0,.12);
box(g,1.68,2.30,.08,dark,0,2.06,.61,.08);
box(g,1.51,2.09,.025,black,0,2.08,.663,.035);
const screen=canvasTex(900,1200,(c,w,h)=>{c.fillStyle='#071a25';c.fillRect(0,0,w,h);const gr=c.createRadialGradient(650,100,0,650,100,1000);gr.addColorStop(0,'#155565');gr.addColorStop(1,'#07141e');c.fillStyle=gr;c.fillRect(0,0,w,h);c.fillStyle='#81eada';c.font='22px monospace';c.fillText('N / PERSONAL ARCHIVE',65,80);c.fillStyle='#f1fbff';c.font='bold 65px Arial';c.fillText(machinesTitle(key),65,200);c.fillStyle='#84aebd';c.font='25px monospace';c.fillText('SELECT TO ENTER',65,263);const names=items[key].map(i=>i.name);names.forEach((name,i)=>{const y=365+i*140;c.fillStyle='#11313f';c.fillRect(55,y,790,110);c.strokeStyle='#2e6170';c.strokeRect(55,y,790,110);c.fillStyle='#6ee2cf';c.fillRect(84,y+30,40,34);c.fillRect(84,y+24,22,12);c.fillStyle='#dcecf0';c.font='30px Arial';c.fillText(name,155,y+64);c.fillStyle='#79bac7';c.fillText('↗',780,y+64);});c.fillStyle='#71cbbf';c.font='20px monospace';c.fillText('● CONNECTED     /     NISHAL',65,1140);});
mesh(g,new THREE.PlaneGeometry(1.48,2.02),new THREE.MeshBasicMaterial({map:screen,toneMapped:false}),0,2.08,.681,false);
for(const side of [-1,1])beam(g,[side*.80,.97,.68],[side*.80,3.19,.68],.009,glow(0x4cddcf,1.6));
box(g,1.65,.52,.13,dark,0,3.72,.10,.065);for(const x of [-.58,.58])box(g,.065,.32,.08,dark,x,3.43,.10);
outline(g,1.59,.46,.183,0,3.72,.012,99);label(g,machinesTitle(key).toUpperCase(),1.48,.36,0,3.72,.189,'#ff83c9',100);
box(g,1.78,.10,.49,white,0,.90,.72,.03);box(g,1.44,.018,.31,dark,0,.96,.73,.01);
for(let row=0;row<3;row++)for(let k=0;k<13;k++)box(g,.072,.018,.055,k===12?glow(0x46cdbb,.3):black,-.6+k*.1,.98,.64+row*.075,.005);
box(g,1.65,.58,.025,print,0,.47,.59,.02);for(let k=0;k<9;k++)box(g,.55,.016,.02,black,0,.30+k*.035,.612,.003);
box(g,1.78,.14,1.18,dark,0,.10,0,.045);label(g,'OPEN ARCHIVE',.7,.10,0,.76,.626,'#8ce9db',70);
for(const x of [-.83,.83])for(const y of [.2,.8,3.3]){const screw=cyl(g,.012,.012,.01,chrome,x,y,.60);screw.rotation.x=Math.PI/2;}
g.traverse(o=>{if(o.isMesh)o.userData.machine=key;});models.push(m);return m;}
function machinesTitle(key){return {about:'About Me',experience:'Experience',projects:'Projects'}[key];}
keys.forEach(makeMachine);
// A coherent nighttime street built from geometry: pavement, wall, canopy and lights.
const paving=new THREE.MeshStandardMaterial({color:0x354550,roughness:.88,metalness:0,map:roadMap,bumpMap:roadMap,bumpScale:.012});
box(scene,22,.15,4.6,paving,0,-.08,-.5,.02);
for(let x=-11;x<11;x+=.8){box(scene,.785,.16,.32,paving,x,-.045,1.65,.018);for(let z=-2.5;z<1.5;z+=.8)box(scene,.79,.018,.79,paving,x,.008,z,.008);}
const brickMat=new THREE.MeshStandardMaterial({color:0x152b33,roughness:.85});
box(scene,23,4,.25,brickMat,0,1.8,-2.3);
const wood=new THREE.MeshStandardMaterial({color:0x12252d,roughness:.56,metalness:.15});
for(let x=-11;x<=11;x+=.22)box(scene,.13,3.7,.09,wood,x,1.8,-2.12,.007);
box(scene,23,.16,2.0,dark,0,4.24,-1.6,.03);
for(let x=-10;x<=10;x+=4){box(scene,.1,4.35,.1,dark,x,2,-.85,.008);box(scene,.45,.035,.20,glow(0xffb975,1),x,4.12,-1.1,.008);const lamp=new THREE.PointLight(0xffaa66,9,5,2);lamp.position.set(x,3.85,-.75);scene.add(lamp);}
for(let x=-18;x<18;x+=3.1){const stripe=new THREE.Mesh(new THREE.PlaneGeometry(1.7,.10),new THREE.MeshStandardMaterial({color:0x8796a2,roughness:.45}));stripe.rotation.x=-Math.PI/2;stripe.position.set(x,-.155,4.8);scene.add(stripe);}
// Distant architectural silhouettes and inset windows give the scene depth.
for(let i=0;i<13;i++){const x=(i-6)*2.4,h=5+(i*7%5);box(scene,2.2,h,2.5,new THREE.MeshStandardMaterial({color:i%2?0x0b1b2c:0x112532,roughness:.9}),x,h/2-1,-6,.02);for(let y=4;y<h-1;y+=.7)for(let k=0;k<3;k++)if((i+y*10+k)%3>1)box(scene,.25,.36,.02,glow(i%3?0x1a5368:0xb87b52,.3),x-.65+k*.65,y,-4.74,.002);}
const composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));composer.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth,innerHeight),.16,.4,1.5));composer.addPass(new OutputPass());
let cameraMove=null;let active=null,view='about',angle=.07,drag=false,startX=0,startY=0,moved=false,frameCount=0;const look=new THREE.Vector3(0,1.65,0),targetLook=new THREE.Vector3(),targetPos=new THREE.Vector3(),tweens=[];const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
function cameraGoal(){if(active){targetLook.set(active.x,2.08,.68);const height=Math.max(2.05,1.50/camera.aspect),dist=height/(2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2)))+.5;targetPos.set(active.x,2.08,dist);}else{targetLook.set(0,1.9,0);const height=Math.max(6.5,9.9/camera.aspect),dist=height/(2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2)))+.8;targetPos.set(Math.sin(angle)*dist,3.1,Math.cos(angle)*dist);}cameraMove=drag?null:{start:performance.now(),position:camera.position.clone(),look:look.clone(),to:targetPos.clone(),target:targetLook.clone()};}
let terminalTimer;
function focus(m){clearTimeout(terminalTimer);active=m;models.forEach(other=>other.group.visible=other===m);view=m.key;back.hidden=false;cameraGoal();terminalTimer=setTimeout(()=>window.openTerminal(m.key),reduced?0:1250);}
function overview(){clearTimeout(terminalTimer);window.closeTerminal?.();active=null;models.forEach(m=>m.group.visible=true);back.hidden=true;cameraGoal();}
function hit(event){const r=renderer.domElement.getBoundingClientRect();pointer.set((event.clientX-r.left)/r.width*2-1,-(event.clientY-r.top)/r.height*2+1);raycaster.setFromCamera(pointer,camera);return raycaster.intersectObjects(models.filter(m=>m.group.visible).map(m=>m.group),true)[0];}
renderer.domElement.addEventListener('pointermove',e=>{renderer.domElement.style.cursor=hit(e)?'pointer':'default';});renderer.domElement.addEventListener('click',e=>{const h=hit(e);if(h)focus(models.find(m=>m.key===h.object.userData.machine));});
back.addEventListener('click',overview);document.querySelectorAll('[data-machine]').forEach(b=>b.addEventListener('click',()=>focus(models[keys.indexOf(b.dataset.machine)])));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!document.querySelector('#panel').open)overview();});
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);composer.setSize(innerWidth,innerHeight);cameraGoal();});cameraGoal();camera.position.copy(targetPos);look.copy(targetLook);cameraMove=null;
window.arcade3D={transitioning:()=>!!cameraMove,focus:key=>focus(models[keys.indexOf(key)]),overview,state:()=>models.map(m=>({key:m.key,visible:m.group.visible}))};
function animate(t){requestAnimationFrame(animate);for(let i=tweens.length-1;i>=0;i--){const tw=tweens[i],p=Math.min((t-tw.start)/tw.duration,1),e=p*p*(3-2*p);for(const k of Object.keys(tw.props))tw.obj[k]=tw.from[k]+(tw.props[k]-tw.from[k])*e;if(p===1){tweens.splice(i,1);tw.resolve();}}if(cameraMove){const p=reduced?1:Math.min(1,(t-cameraMove.start)/1250),e=p*p*p*(p*(p*6-15)+10);camera.position.lerpVectors(cameraMove.position,cameraMove.to,e);look.lerpVectors(cameraMove.look,cameraMove.target,e);if(p===1)cameraMove=null;}else{camera.position.lerp(targetPos,reduced?1:.1);look.lerp(targetLook,reduced?1:.1);}camera.lookAt(look);composer.render();if(++frameCount===3){document.querySelector('#loading').hidden=true;document.body.dataset.ready='true';}}requestAnimationFrame(animate);
