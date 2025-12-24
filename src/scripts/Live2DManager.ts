/**
 * Live2DManager.ts
 * 
 * 专门用于管理 oh-my-live2d 在 Astro + SWUP 环境下的持久化、样式恢复及生命周期。
 * 采用单例模式，确保全局只有一个管理器实例。
 */

import type { Live2DConfig } from '../types/config';

export class Live2DManager {
  private static instance: Live2DManager;
  private oml2d: any = null;
  private isInitialized = false;
  private isInitializing = false;
  private configSignature: string | null = null;
  private libraryStyles: string[] = [];
  private welcomeShown = false;
  private rootElement: HTMLElement | null = null;
  private currentExpressionIndex = -1;

  private constructor() {
    if (typeof window !== 'undefined') {
      // 尝试从 sessionStorage 恢复欢迎语状态，确保刷新页面也不重复触发
      this.welcomeShown = sessionStorage.getItem('oml2d_welcome_shown') === 'true';
      this.setupEventListeners();
    }
  }

  public static getInstance(): Live2DManager {
    if (typeof window === 'undefined') {
      if (!Live2DManager.instance) Live2DManager.instance = new Live2DManager();
      return Live2DManager.instance;
    }

    if (!(window as any).__OML2D_MANAGER__) {
      console.log('[OML2D] Creating new Manager instance');
      (window as any).__OML2D_MANAGER__ = new Live2DManager();
      (window as any).Live2DManager = Live2DManager; // 方便控制台调试
    } else {
      console.log('[OML2D] Reusing existing Manager instance');
    }
    return (window as any).__OML2D_MANAGER__;
  }

  /**
   * 初始化或复用 Live2D 实例
   */
  public async init(config: Live2DConfig, configStr: string): Promise<void> {
    if (typeof window === 'undefined') return;
    
    // 检查全局锁定，防止并发初始化
    if ((window as any).__OML2D_LOCK__) {
      console.log('[OML2D] Initialization locked, skipping.');
      return;
    }

    console.log('[OML2D] Init called. isInitialized:', this.isInitialized, 'isInitializing:', this.isInitializing);

    // 确保持久化根节点存在
    this.ensureRootContainer();

    // 如果实例已存在，直接复用（不再强依赖 isInitialized，防止事件丢失导致重复创建）
    if (this.oml2d) {
      console.log('[OML2D] Instance exists, handling transition.');
      if (!this.isInitialized) {
        console.warn('[OML2D] Instance exists but isInitialized was false. Marking as initialized.');
        this.isInitialized = true;
      }
      this.handleRouteTransition();
      return;
    }

    // 如果正在初始化，直接跳过
    if (this.isInitializing) {
      console.log('[OML2D] Already initializing, skipping.');
      return;
    }

    console.log('[OML2D] Starting full initialization');
    this.isInitializing = true;
    (window as any).__OML2D_LOCK__ = true;

    try {
      // 彻底清理旧的 DOM 节点，防止重复加载出现多个模型
      const oldElements = document.querySelectorAll('#oml2d-stage, .oml2d-stage, #oml2d-statusBar, #oml2d-menus, #oml2d-global-style');
      oldElements.forEach(el => el.remove());

      console.log('[OML2D] Importing oh-my-live2d...');
      const { loadOml2d } = await import('oh-my-live2d');
      
      this.configSignature = configStr;
      const processedConfig = this.preprocessConfig(config);
      
      this.oml2d = loadOml2d(processedConfig);

      this.oml2d.onLoad((status: string) => {
        console.log('[OML2D] Library onLoad status:', status);
        this.isInitializing = false;
        (window as any).__OML2D_LOCK__ = false;
        if (status === 'success') {
          this.isInitialized = true;
          this.handleFirstLoadSuccess(config);
        }
      });

    } catch (error) {
      this.isInitializing = false;
      (window as any).__OML2D_LOCK__ = false;
      console.error('[OML2D] Initialization failed', error);
    }
  }

  /**
   * 预处理配置，禁用自动欢迎语
   */
  private preprocessConfig(config: Live2DConfig): any {
    // 深度克隆配置以避免修改原始对象
    const finalConfig = JSON.parse(JSON.stringify(config));
    
    // 彻底禁用库内置的欢迎语触发（v0.19.3 库源码中没有 enable 开关，直接清空消息）
    if (finalConfig.tips?.welcomeTips) {
      finalConfig.tips.welcomeTips.message = {};
    }
    
    // 设置父容器为持久化根节点
    finalConfig.parentElement = this.rootElement;

    // 处理自定义菜单项
    if (config.custom?.menu?.items) {
      finalConfig.menus = finalConfig.menus || {};
      finalConfig.menus.items = config.custom.menu.items.map(item => ({
        id: item.id,
        title: item.title,
        icon: item.icon,
        onClick: (oml2d: any) => {
          console.log('[OML2D] Menu item clicked:', item.action);
          if (item.action === 'rest') {
            // 优先使用 Fork 版本新增的 sleep 方法
            if (typeof oml2d.sleep === 'function') {
              oml2d.sleep();
              // 监听状态栏点击以恢复表情
              const originalClick = oml2d.statusBar.element.onclick;
              oml2d.setStatusBarClickEvent(() => {
                if (originalClick) originalClick();
                setTimeout(() => this.applyDefaultExpression(config), 1000);
              });
            } else {
              // 回退到手动实现
              const restMsg = oml2d.options?.statusBar?.restMessage || '看板娘打个盹，戳我唤醒~';
              oml2d.statusBarOpen(restMsg);
              oml2d.clearTips();
              oml2d.setStatusBarClickEvent(() => {
                oml2d.statusBarClose();
                oml2d.stageSlideIn();
                oml2d.statusBarClearEvents();
                setTimeout(() => this.applyDefaultExpression(config), 1000);
              });
              if (oml2d.stageSlideOut) oml2d.stageSlideOut();
            }
          } else if (item.action === 'cycle-expression') {
            this.cycleExpression(config);
          }
        }
      }));
    }
    
    // 移除自定义扩展字段，避免传给库报错
    delete finalConfig.custom;
    
    return finalConfig;
  }

  /**
   * 首次加载成功后的处理
   */
  private handleFirstLoadSuccess(config: Live2DConfig): void {
    console.log('Live2DManager: First load success');
    
    // 1. 捕获样式
    setTimeout(() => this.captureLibraryStyles(), 500);
    
    // 2. 注入手动补丁样式
    this.injectManualStyles();
    
    // 3. 触发欢迎语（仅限首次）
    if (!this.welcomeShown) {
      this.triggerWelcomeTips(config);
      this.welcomeShown = true;
      sessionStorage.setItem('oml2d_welcome_shown', 'true');
    }

    // 4. 应用默认表情
    this.applyDefaultExpression(config);

    // 5. 启动 Idle Player
    if (this.oml2d.tips?.idlePlayer) {
      this.oml2d.tips.idlePlayer.start();
    }
  }

  /**
   * 应用默认表情
   */
  private applyDefaultExpression(config: Live2DConfig): void {
    const defaultExp = config.custom?.defaultExpression;
    if (defaultExp) {
      console.log('[OML2D] Applying default expression:', defaultExp);
      this.setExpressionSafely(defaultExp);
    }
  }

  /**
   * 循环切换表情
   */
  private cycleExpression(config: Live2DConfig): void {
    const expressions = config.custom?.expressions;
    if (!expressions || expressions.length === 0) return;

    this.currentExpressionIndex = (this.currentExpressionIndex + 1) % expressions.length;
    const exp = expressions[this.currentExpressionIndex];

    console.log('[OML2D] Setting expression:', exp.name);
    this.setExpressionSafely(exp.name, exp.tip);
  }

  /**
   * 安全地设置表情（兼容 v0.19.3 及 Fork 版本）
   */
  private setExpressionSafely(name: string, tip?: string): void {
    if (!this.oml2d) return;

    try {
      // 优先使用 Fork 版本新增的顶层方法
      if (typeof this.oml2d.setExpression === 'function') {
        this.oml2d.setExpression(name);
      } else {
        // 回退到 v0.19.3 的原始路径
        const model = this.oml2d.models?.model;
        if (model && typeof model.expression === 'function') {
          model.expression(name);
        }
      }

      // 显示提示
      if (tip && this.oml2d.tipsMessage) {
        this.oml2d.tipsMessage(tip, 3000, 3);
      }
    } catch (e) {
      console.error('[OML2D] Failed to set expression:', e);
    }
  }

  /**
   * 处理路由切换（SWUP / View Transitions）
   */
  private handleRouteTransition(): void {
    console.log(`[OML2D-V2-${new Date().getTime()}] Handling route transition`);
    
    // 1. 确保根容器在 body 中且可见
    this.ensureRootContainer();
    console.log('[OML2D] Root element state:', {
      exists: !!this.rootElement,
      id: this.rootElement?.id,
      isConnected: this.rootElement?.isConnected,
      parent: this.rootElement?.parentElement?.tagName
    });

    if (this.rootElement) {
      this.rootElement.style.display = 'block';
      if (!this.rootElement.isConnected) {
        console.log('[OML2D] Root element disconnected, re-attaching to body');
        document.body.appendChild(this.rootElement);
      }
    }

    // 2. 确保样式和图标存在（SWUP 可能会替换 head）
    this.restoreLibraryStyles();
    this.injectManualStyles();
    this.ensureIconsInjected();

    // 3. 使用库原生的 reMount 方法重新挂载
    if (this.oml2d && typeof this.oml2d.reMount === 'function') {
      console.log('[OML2D] Calling reMount with:', this.rootElement?.id);
      this.oml2d.reMount(this.rootElement);
    }

    // 4. 尝试触发 PIXI 调整大小
    if (this.oml2d.pixiApp?.resize) {
      console.log('[OML2D] Triggering resize');
      this.oml2d.pixiApp.resize();
      setTimeout(() => {
        console.log('[OML2D] Delayed resize');
        this.oml2d.pixiApp?.resize?.();
      }, 200);
    }

    // 5. 确保 Idle Player 运行
    const idlePlayer = this.oml2d?.tips?.idlePlayer;
    if (idlePlayer && !idlePlayer.timer) {
      idlePlayer.start();
    }
  }

  /**
   * 触发欢迎语
   */
  private triggerWelcomeTips(config: Live2DConfig): void {
    const tips = config.tips;
    if (!tips || typeof tips !== 'object') return;
    
    const welcomeConfig = (tips as any).welcomeTips;
    if (!welcomeConfig || !welcomeConfig.message) return;

    const hour = new Date().getHours();
    let message = '';
    const msgs = welcomeConfig.message as any;

    if (hour >= 5 && hour < 7) message = msgs.daybreak;
    else if (hour >= 7 && hour < 11) message = msgs.morning;
    else if (hour >= 11 && hour < 14) message = msgs.noon;
    else if (hour >= 14 && hour < 17) message = msgs.afternoon;
    else if (hour >= 17 && hour < 19) message = msgs.dusk;
    else if (hour >= 19 && hour < 22) message = msgs.night;
    else if (hour >= 22 || hour < 2) message = msgs.lateNight;
    else message = msgs.weeHours;

    if (message && this.oml2d?.tipsMessage) {
      this.oml2d.tipsMessage(message, welcomeConfig.duration || 5000, welcomeConfig.priority || 3);
    }
  }

  /**
   * 确保持久化根节点存在
   */
  private ensureRootContainer(): void {
    if (this.rootElement && this.rootElement.isConnected) return;

    let root = document.getElementById('live2d-persistent-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'live2d-persistent-root';
      document.body.appendChild(root);
    }
    this.rootElement = root;
  }

  /**
   * 捕获库生成的样式
   */
  private captureLibraryStyles(): void {
    const styles = document.querySelectorAll('style');
    const captured: string[] = [];
    for (const style of styles) {
      if (style.textContent && (style.textContent.includes('.oml2d-') || style.textContent.includes('#oml2d'))) {
        if (style.textContent.length > 50000) continue;
        captured.push(style.textContent);
      }
    }
    if (captured.length > 0) {
      this.libraryStyles = captured;
    }
  }

  /**
   * 恢复样式
   */
  private restoreLibraryStyles(): void {
    this.libraryStyles.forEach((css, index) => {
      const id = `oml2d-restored-style-${index}`;
      if (!document.getElementById(id)) {
        const style = document.createElement('style');
        style.id = id;
        style.textContent = css;
        document.head.appendChild(style);
      }
    });
  }

  /**
   * 注入手动补丁样式
   */
  private injectManualStyles(): void {
    const id = 'oml2d-manual-patch-style';
    if (document.getElementById(id)) return;

    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
      .oml2d-icon, .svgfont {
        width: 1em !important; height: 1em !important;
        fill: currentColor !important; vertical-align: -0.15em !important;
        font-size: 24px !important; display: inline-block !important;
      }
      .oml2d-tips { transition: opacity 0.3s ease !important; }
    `;
    document.head.appendChild(style);
  }

  /**
   * 恢复图标
   */
  private ensureIconsInjected(): void {
    // @ts-ignore
    const svgString = window._iconfont_svg_string_3847283;
    if (!svgString || document.getElementById('icon-rest')) return;

    const div = document.createElement('div');
    div.innerHTML = svgString;
    const svg = div.querySelector('svg');
    if (svg) {
      svg.style.display = 'none';
      document.body.insertBefore(svg, document.body.firstChild);
    }
  }

  /**
   * 设置事件监听
   */
  private setupEventListeners(): void {
    const refresh = () => {
      console.log('[OML2D] Route change detected, refreshing...');
      
      // 如果已经初始化，直接处理路由切换逻辑（现在是幂等的）
      if (this.oml2d && this.isInitialized) {
        this.handleRouteTransition();
        return;
      }

      // 否则尝试初始化
      const container = document.getElementById('live2d-container');
      if (container) {
        const config = JSON.parse(container.getAttribute('data-config') || '{}');
        const configStr = container.getAttribute('data-config') || '';
        this.init(config, configStr);
      }
    };

    // SWUP 事件
    document.addEventListener('swup:contentReplaced', refresh);
    
    // Astro View Transitions 事件
    document.addEventListener('astro:after-swap', refresh);

    // 复制提醒
    window.addEventListener('copy', () => {
      const container = document.getElementById('live2d-container');
      if (!container) return;
      const config = JSON.parse(container.getAttribute('data-config') || '{}');
      const copyTips = config.tips?.copyTips;

      if (copyTips && copyTips.enable && this.oml2d?.tips?.notification) {
        this.oml2d.tips.notification(copyTips.message || '复制成功，引用请注明出处哦~', { 
          duration: copyTips.duration || 3000, 
          priority: copyTips.priority || 3 
        });
      }
    });
  }
}
