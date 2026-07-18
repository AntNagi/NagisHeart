import { DataLoader } from './data/DataLoader.js';
import { AudioManager } from './data/AudioManager.js';
import { GameController } from './controller/GameController.js';
import { Router } from './ui/Router.js';
import { SplashScreen } from './ui/screens/SplashScreen.js';
import { StartScreen } from './ui/screens/StartScreen.js';
import { PrologueScreen } from './ui/screens/PrologueScreen.js';
import { NameSetupScreen } from './ui/screens/NameSetupScreen.js';
import { GameScreen } from './ui/screens/GameScreen.js';
import { EndingScreen } from './ui/screens/EndingScreen.js';

async function init() {
  const app = document.getElementById('app');

  app.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-secondary);font-size:14px;">Loading...</div>';

  try {
    const loader = new DataLoader('../story-data');
    const storyData = await loader.loadAll();

    const controller = new GameController(storyData);
    const audioManager = new AudioManager(controller.getSettingsManager());

    controller.addEventListener('scenechange', (e) => {
      const visual = e.detail;
      if (visual.bgm) {
        audioManager.play(visual.bgm);
      }
    });

    const router = new Router(app);
    router.register('splash', SplashScreen);
    router.register('start', StartScreen);
    router.register('prologue', PrologueScreen);
    router.register('nameSetup', NameSetupScreen);
    router.register('game', GameScreen);
    router.register('ending', EndingScreen);

    router.setContext({ controller, audioManager });
    router.navigate('splash');
  } catch (err) {
    console.error('Init failed:', err);
    app.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#C98A96;font-size:14px;padding:20px;text-align:center;">
      加载失败<br><small style="color:#6E7A89;margin-top:8px;display:block;">${err.message}</small>
    </div>`;
  }
}

init();
