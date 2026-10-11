import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const LAYERS = [3, 5, 5, 3];
const COLORS = [0x5fd1c1, 0x9d8cf0, 0xb3a4ff, 0xffb27a];

function SvgNetwork({ motion }) {
  const x = l => 70 + l * 160, y = (l, n) => 150 + (n - (LAYERS[l] - 1) / 2) * 52;
  return <svg className="network-svg" viewBox="0 0 620 300" role="img" aria-label="Neural network">
    {LAYERS.slice(0, -1).flatMap((n, l) => Array.from({ length: n }, (_, a) => Array.from({ length: LAYERS[l + 1] }, (_, b) => <line key={`${l}-${a}-${b}`} x1={x(l)} y1={y(l, a)} x2={x(l + 1)} y2={y(l + 1, b)} stroke="#4f7397" opacity=".5" />)))}
    {LAYERS.flatMap((n, l) => Array.from({ length: n }, (_, k) => <circle key={`${l}-${k}`} cx={x(l)} cy={y(l, k)} r="11" fill={`#${COLORS[l].toString(16)}`} className={motion ? 'pulse' : ''} style={{ animationDelay: `${l * .25}s` }} />))}
  </svg>;
}

export default function NeuralNetwork({ motion = true, labels, hint }) {
  const mount = useRef(null);
  const [fallback, setFallback] = useState(false);
  const opts = useRef({ motion });
  opts.current = { motion };

  useEffect(() => {
    if (fallback) return;
    const host = mount.current;
    let renderer, frame = 0, controls, observer, disposed = false;
    const scene = new THREE.Scene();
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
      host.appendChild(renderer.domElement);
      const camera = new THREE.PerspectiveCamera(38, 1, .1, 100);
      camera.position.set(0, .8, 11);
      controls = new OrbitControls(camera, renderer.domElement);
      Object.assign(controls, { enableDamping: true, enablePan: false, enableZoom: false });
      const group = new THREE.Group(); scene.add(group);
      const nodes = [];
      const geo = new THREE.SphereGeometry(.17, 16, 12);
      const mats = COLORS.map(color => new THREE.MeshBasicMaterial({ color }));
      LAYERS.forEach((n, l) => { nodes[l] = []; for (let j = 0; j < n; j++) { const p = new THREE.Vector3((l - 1.5) * 2.7, (j - (n - 1) / 2) * 1.05, Math.sin(j * 2 + l) * .8); const m = new THREE.Mesh(geo, mats[l]); m.position.copy(p); group.add(m); nodes[l].push(p); } });
      const pairs = [];
      for (let l = 0; l < LAYERS.length - 1; l++) for (const a of nodes[l]) for (const b of nodes[l + 1]) pairs.push([a, b]);
      group.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pairs.flat()), new THREE.LineBasicMaterial({ color: 0x5b84a8, transparent: true, opacity: .45 })));
      const dotGeo = new THREE.SphereGeometry(.06, 8, 8), dotMat = new THREE.MeshBasicMaterial({ color: 0xffe3a0 });
      const dots = pairs.filter((_, i) => i % 3 === 0).map((pair, i) => { const d = new THREE.Mesh(dotGeo, dotMat); group.add(d); return { d, pair, off: (i * .073) % 1 }; });
      const resize = () => { if (!host.clientWidth || !host.clientHeight) return; renderer.setSize(host.clientWidth, host.clientHeight); camera.aspect = host.clientWidth / host.clientHeight; camera.updateProjectionMatrix(); };
      observer = new ResizeObserver(resize); observer.observe(host); resize();
      let last = 0, time = 0;
      const draw = now => {
        if (disposed) return;
        const dt = Math.min((now - last) / 1000, .04); last = now;
        if (!document.hidden) {
          if (opts.current.motion) { time += dt; group.rotation.y += dt * .12; }
          dots.forEach(({ d, pair, off }) => d.position.lerpVectors(pair[0], pair[1], (time * .45 + off) % 1));
          controls.update(); renderer.render(scene, camera);
        }
        frame = requestAnimationFrame(draw);
      };
      frame = requestAnimationFrame(draw);
    } catch { setFallback(true); }
    return () => {
      disposed = true; cancelAnimationFrame(frame); observer?.disconnect(); controls?.dispose();
      scene.traverse(o => { o.geometry?.dispose(); if (o.material) [].concat(o.material).forEach(m => m.dispose()); });
      renderer?.dispose(); renderer?.domElement.remove();
    };
  }, [fallback]);

  return <div className="network-stage">
    <div className="network-labels"><span>{labels.input}</span><span>{labels.hidden}</span><span>{labels.output}</span></div>
    {fallback ? <SvgNetwork motion={motion} /> : <div className="webgl" ref={mount} />}
    <span className="network-tag">{hint}</span>
  </div>;
}
