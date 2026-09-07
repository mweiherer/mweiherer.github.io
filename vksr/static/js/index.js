window.HELP_IMPROVE_VIDEOJS = false;

var DATASET_VIEWER_CONFIGS_BY_GRID = new Map();
var DATASET_VIEWER_INSTANCES_BY_GRID = new Map();
var DATASET_VIEWER_TIMINGS_CACHE = new Map();
var DATASET_VIEWER_ENABLE_RENDER_HEARTBEAT = true;
var DATASET_VIEWER_LOAD_TIMEOUT_MS = 30000;
var DATASET_VIEWER_MAX_LOAD_RETRIES = 5;
var DATASET_VIEWER_CONTEXT_WATCHDOG_INTERVAL_MS = 700;

function getDefaultMethodConfigs() {
  return [
    { id: '01_rimls', label: 'RIMLS', color: 0x76839b },
    { id: '02_sap', label: 'SAP', color: 0x76839b },
    { id: '03_spsr', label: 'SPSR', color: 0x76839b },
    { id: '04_ns', label: 'NS', color: 0x76839b },
    { id: '05_matern_12', label: 'Matern 1/2', color: 0x76839b },
    { id: '06_matern_32', label: 'Matern 3/2', color: 0x76839b },
    { id: '07_ours', label: 'Ours', color: 0x76839b }
  ];
}

function getStanfordMethodConfigs() {
  return [
    { id: '01_spsr', label: 'SPSR', color: 0x76839b },
    { id: '02_ns', label: 'NS', color: 0x76839b },
    { id: '03_ns_chunked', label: 'NS (Chnk.)', color: 0x76839b },
    { id: '04_matern_12', label: 'Matern 1/2', color: 0x76839b },
    { id: '05_matern_12_chunked', label: 'Matern 1/2 (Chnk.)', color: 0x76839b },
    { id: '06_matern_32', label: 'Matern 3/2', color: 0x76839b },
    { id: '07_matern_32_chunked', label: 'Matern 3/2 (Chnk.)', color: 0x76839b },
    { id: '08_ours_exact', label: 'Ours (Exact)', color: 0x1f6feb },
    { id: '09_ours_approximate', label: 'Ours (Approx.)', color: 0x3a7fe8 }
  ];
}

function getScanNetMethodConfigs() {
  return [
    { id: '01_nksr', label: 'NKSR', color: 0x76839b },
    { id: '02_rimls', label: 'RIMLS', color: 0x76839b },
    { id: '03_spsr', label: 'SPSR', color: 0x76839b },
    { id: '04_ours', label: 'Ours', color: 0x1f6feb }
  ];
}

function createDatasetViewerConfig(options) {
  var methods = options.methods || getDefaultMethodConfigs();
  return {
    gridId: options.gridId,
    buttonContainerId: options.buttonContainerId,
    methodSelectorId: options.methodSelectorId,
    basePath: options.basePath,
    alwaysVisibleMethodId: options.alwaysVisibleMethodId || '07_ours',
    maxComparisonMethods: options.maxComparisonMethods || 3,
    methods: methods,
    models: options.models,
    defaultModel: options.defaultModel || options.models[0].id,
    meshFileSuffix: options.meshFileSuffix || '',
    geometryRotationX: typeof options.geometryRotationX === 'number' ? options.geometryRotationX : (-Math.PI / 2),
    defaultPlaneAngleDeg: typeof options.defaultPlaneAngleDeg === 'number' ? options.defaultPlaneAngleDeg : 0,
    defaultPitchAngleDeg: typeof options.defaultPitchAngleDeg === 'number' ? options.defaultPitchAngleDeg : 0,
    renderParamsByModel: options.renderParamsByModel || {},
    modelPointLabelById: options.modelPointLabelById || {},
    lazyInit: !!options.lazyInit
  };
}

function createDatasetViewerConfigs() {
  return [
    createDatasetViewerConfig({
      gridId: 'shapenet-dense-viewer-grid',
      buttonContainerId: 'shapenet-dense-viewer-model-buttons',
      methodSelectorId: 'shapenet-dense-viewer-method-selector',
      basePath: './static/shapenet_reconstructions_downsampled/dense',
      geometryRotationX: 0,
      defaultPlaneAngleDeg: 135.0,
      defaultPitchAngleDeg: 20.0,
      models: [
        { id: 'bench', label: 'Bench' },
        { id: 'car', label: 'Car' },
        { id: 'plane', label: 'Plane' },
        { id: 'rifle', label: 'Rifle' }
      ],
      defaultModel: 'bench'
    }),
    createDatasetViewerConfig({
      gridId: 'shapenet-sparse-viewer-grid',
      buttonContainerId: 'shapenet-sparse-viewer-model-buttons',
      methodSelectorId: 'shapenet-sparse-viewer-method-selector',
      basePath: './static/shapenet_reconstructions_downsampled/sparse',
      geometryRotationX: 0,
      defaultPlaneAngleDeg: 135.0,
      defaultPitchAngleDeg: 20.0,
      models: [
        { id: 'bench', label: 'Bench' },
        { id: 'car', label: 'Car' },
        { id: 'plane', label: 'Plane' },
        { id: 'rifle', label: 'Rifle' }
      ],
      defaultModel: 'bench',
      lazyInit: true
    }),
    createDatasetViewerConfig({
      gridId: 'srb-dense-viewer-grid',
      buttonContainerId: 'srb-dense-viewer-model-buttons',
      methodSelectorId: 'srb-dense-viewer-method-selector',
      basePath: './static/srb_reconstructions_downsampled',
      geometryRotationX: 0,
      renderParamsByModel: {
        anchor: { planeAngleDeg: 135, pitchAngleDeg: 40 },
        daratech: { planeAngleDeg: 15, pitchAngleDeg: 25 },
        dc: { planeAngleDeg: -20, pitchAngleDeg: 20 },
        gargoyle: { planeAngleDeg: 37, pitchAngleDeg: 20 },
        lord_quas: { planeAngleDeg: -10, pitchAngleDeg: 20 }
      },
      modelPointLabelById: {
        anchor: '85K input points',
        daratech: '61K input points',
        dc: '71K input points',
        gargoyle: '95K input points',
        lord_quas: '57K input points'
      },
      models: [
        { id: 'anchor', label: 'Anchor' },
        { id: 'daratech', label: 'Daratech' },
        { id: 'dc', label: 'DC' },
        { id: 'gargoyle', label: 'Gargoyle' },
        { id: 'lord_quas', label: 'Lord Quas' }
      ],
      defaultModel: 'anchor'
    }),
    createDatasetViewerConfig({
      gridId: 'stanford-viewer-grid',
      buttonContainerId: 'stanford-viewer-model-buttons',
      methodSelectorId: 'stanford-viewer-method-selector',
      basePath: './static/stanford_reconstructions_downsampled',
      geometryRotationX: 0,
      renderParamsByModel: {
        Armadillo: { planeAngleDeg: 0, pitchAngleDeg: 0 },
        dragon_vrip: { planeAngleDeg: 0, pitchAngleDeg: 0 },
        happy_vrip: { planeAngleDeg: 0, pitchAngleDeg: 0 },
        lucy: { planeAngleDeg: 0, pitchAngleDeg: 0 },
        xyzrgb_dragon: { planeAngleDeg: 0, pitchAngleDeg: 0 },
        xyzrgb_statuette: { planeAngleDeg: 0, pitchAngleDeg: 0 }
      },
      modelPointLabelById: {
        Armadillo: '173K input points',
        xyzrgb_dragon: '3.6M input points',
        dragon_vrip: '436K input points',
        happy_vrip: '544K input points',
        lucy: '14M input points',
        xyzrgb_statuette: '5.1M input points'
      },
      methods: getStanfordMethodConfigs(),
      alwaysVisibleMethodId: '09_ours_approximate',
      models: [
        { id: 'Armadillo', label: 'Armadillo' },
        { id: 'xyzrgb_dragon', label: 'Asian Dragon' },
        { id: 'dragon_vrip', label: 'Dragon' },
        { id: 'happy_vrip', label: 'Happy Buddha' },
        { id: 'lucy', label: 'Lucy' },
        { id: 'xyzrgb_statuette', label: 'Thai Statue' }
      ],
      defaultModel: 'Armadillo'
    }),
    createDatasetViewerConfig({
      gridId: 'scannet-viewer-grid',
      buttonContainerId: 'scannet-viewer-model-buttons',
      methodSelectorId: 'scannet-viewer-method-selector',
      basePath: './static/scannet_reconstructions_downsampled',
      geometryRotationX: 0,
      methods: getScanNetMethodConfigs(),
      alwaysVisibleMethodId: '04_ours',
      modelPointLabelById: {
        scene0073_00: '92K input points',
        scene0087_02: '167K input points',
        scene0092_01: '142K input points',
        scene0101_00: '282K input points',
        scene0288_00: '154K input points',
        scene0673_05: '361K input points'
      },
      models: [
        { id: 'scene0073_00', label: 'Scene 0073_00' },
        { id: 'scene0087_02', label: 'Scene 0087_02' },
        { id: 'scene0092_01', label: 'Scene 0092_01' },
        { id: 'scene0101_00', label: 'Scene 0101_00' },
        { id: 'scene0288_00', label: 'Scene 0288_00' },
        { id: 'scene0673_05', label: 'Scene 0673_05' }
      ],
      defaultModel: 'scene0073_00'
    })
  ];
}

function initShapeNetViewerTabs() {
  var tabRoot = document.getElementById('shapenet-viewer-tabs');
  if (!tabRoot) {
    return;
  }

  var tabItems = Array.from(tabRoot.querySelectorAll('li[data-shapenet-tab]'));
  var panelDense = document.getElementById('shapenet-tab-panel-dense');
  var panelSparse = document.getElementById('shapenet-tab-panel-sparse');

  function activate(tabName) {
    tabItems.forEach((tabItem) => {
      tabItem.classList.toggle('is-active', tabItem.dataset.shapenetTab === tabName);
    });

    if (panelDense) {
      panelDense.classList.toggle('is-hidden', tabName !== 'dense');
    }
    if (panelSparse) {
      panelSparse.classList.toggle('is-hidden', tabName !== 'sparse');
    }

    if (tabName === 'dense') {
      disposeSingleDatasetViewerByGrid('shapenet-sparse-viewer-grid');
      initSingleDatasetViewerByGrid('shapenet-dense-viewer-grid');
    } else if (tabName === 'sparse') {
      disposeSingleDatasetViewerByGrid('shapenet-dense-viewer-grid');
      initSingleDatasetViewerByGrid('shapenet-sparse-viewer-grid');
    }

    window.dispatchEvent(new Event('resize'));
  }

  tabItems.forEach((tabItem) => {
    tabItem.addEventListener('click', function() {
      activate(tabItem.dataset.shapenetTab);
    });
  });

  activate('dense');
}

class SyncedMeshGridViewer {
  constructor(config) {
    this.config = config;
    this.gridElement = document.getElementById(config.gridId);
    this.buttonContainer = document.getElementById(config.buttonContainerId);
    this.methodSelectorElement = document.getElementById(config.methodSelectorId);
    this.viewerStates = [];
    this.viewerByMethod = {};
    this.currentModel = config.defaultModel;
    this.syncLock = false;
    this.optionalMethods = config.methods.filter((methodConfig) => methodConfig.id !== config.alwaysVisibleMethodId);
    this.selectedOptionalMethodIds = this.optionalMethods
      .slice(0, config.maxComparisonMethods)
      .map((methodConfig) => methodConfig.id);
    this.originalRenderParamsByModel = JSON.parse(JSON.stringify(config.renderParamsByModel || {}));
    this.currentRenderParams = this._getRenderParamsForModel(this.currentModel);
    var defaultCameraDistance = 2.6;
    this.defaultViewState = {
      position: this._getConfiguredViewPosition(defaultCameraDistance, this.currentRenderParams),
      target: new THREE.Vector3(0, 0, 0),
      up: this._getUpVector(this.currentRenderParams),
      zoom: 1
    };
    this.currentViewState = this._cloneViewState(this.defaultViewState);
    this.plyLoader = new THREE.PLYLoader();
    this.renderHeartbeatId = null;
    this.contextRecoveryScheduled = false;
    this.lastRecoveryAtMs = 0;
  }

  init() {
    if (!this.gridElement || !this.buttonContainer || !this.methodSelectorElement) {
      return;
    }
    this._buildMethodSelector();
    this._buildModelButtons();
    this._rebuildViewerGrid();
    this._startRenderHeartbeat();
    this._bindKeyboardReset();
    this._bindResize();
  }

  loadModel(modelId) {
    this.currentModel = modelId;
    this.currentRenderParams = this._getRenderParamsForModel(modelId);
    this._setActiveButton(modelId);
    this._refreshAllCaptions();

    var currentDistance = this.currentViewState.position.length() || 2.6;
    this.currentViewState = {
      position: this._getConfiguredViewPosition(currentDistance, this.currentRenderParams),
      target: new THREE.Vector3(0, 0, 0),
      up: this._getUpVector(this.currentRenderParams),
      zoom: 1
    };
    this.viewerStates.forEach((viewerState) => {
      this._applyViewState(viewerState, this.currentViewState);
    });

    this.viewerStates.forEach((viewerState) => {
      var meshPath = this._getMeshPath(viewerState.methodId, modelId);
      this._setStatus(viewerState, 'Loading...');
      this._loadMeshIntoViewer(viewerState, meshPath);
    });
  }

  resetAllViews() {
    if (this.config.gridId === 'srb-dense-viewer-grid') {
      this.config.renderParamsByModel = JSON.parse(JSON.stringify(this.originalRenderParamsByModel));
    }

    this.currentRenderParams = this._getRenderParamsForModel(this.currentModel);

    var referenceRadius = 1;
    var referenceViewer = this.viewerByMethod[this.config.alwaysVisibleMethodId] || this.viewerStates[0];
    if (
      referenceViewer &&
      referenceViewer.mesh &&
      referenceViewer.mesh.geometry &&
      referenceViewer.mesh.geometry.boundingSphere
    ) {
      referenceRadius = referenceViewer.mesh.geometry.boundingSphere.radius || 1;
    }

    this._fitCenteredView(referenceRadius);

    this.viewerStates.forEach((viewerState) => {
      this._applyViewState(viewerState, this.currentViewState);
    });
    this._renderAll();
  }

  _getActiveMethods() {
    var activeMethodIds = new Set(this.selectedOptionalMethodIds.concat([this.config.alwaysVisibleMethodId]));
    return this.config.methods.filter((methodConfig) => activeMethodIds.has(methodConfig.id));
  }

  _disposeViewerGrid() {
    this.viewerStates.forEach((viewerState) => {
      viewerState.isDisposed = true;
      if (viewerState.pendingTimeoutId) {
        clearTimeout(viewerState.pendingTimeoutId);
        viewerState.pendingTimeoutId = null;
      }
      if (viewerState.mesh) {
        viewerState.scene.remove(viewerState.mesh);
        viewerState.mesh.geometry.dispose();
        viewerState.mesh.material.dispose();
      }
      viewerState.controls.dispose();
      viewerState.renderer.dispose();
    });
    this.viewerStates = [];
    this.viewerByMethod = {};
    this.gridElement.innerHTML = '';
  }

  _rebuildViewerGrid() {
    this._disposeViewerGrid();

    var activeMethods = this._getActiveMethods();
    if (activeMethods.length === 0) {
      return;
    }

    this.gridElement.innerHTML = '';

    activeMethods.forEach((methodConfig) => {
      var card = document.createElement('article');
      card.className = 'dataset-viewer-card';

      var canvasHost = document.createElement('div');
      canvasHost.className = 'dataset-viewer-canvas';

      var status = document.createElement('div');
      status.className = 'dataset-viewer-status';
      status.textContent = 'Loading...';

      var caption = document.createElement('p');
      caption.className = 'dataset-viewer-caption';
      caption.innerHTML = this._buildCaptionHTML(methodConfig.label, '--');

      card.appendChild(canvasHost);
      card.appendChild(status);
      card.appendChild(caption);
      this.gridElement.appendChild(card);

      var viewerState = this._createViewerState(methodConfig, canvasHost, status, caption);
      this.viewerStates.push(viewerState);
      this.viewerByMethod[methodConfig.id] = viewerState;
      this._refreshCaption(viewerState);
    });

    this.loadModel(this.currentModel);
  }

  _buildMethodSelector() {
    this.methodSelectorElement.innerHTML = '';

    this.optionalMethods.forEach((methodConfig) => {
      var optionLabel = document.createElement('label');
      optionLabel.className = 'dataset-viewer-method-option';
      optionLabel.dataset.methodId = methodConfig.id;

      var checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.dataset.methodId = methodConfig.id;
      checkbox.checked = this.selectedOptionalMethodIds.indexOf(methodConfig.id) !== -1;
      checkbox.addEventListener('change', (event) => {
        this._onMethodCheckboxChange(methodConfig.id, event.target.checked);
      });

      var text = document.createElement('span');
      text.textContent = methodConfig.label;

      optionLabel.appendChild(checkbox);
      optionLabel.appendChild(text);
      this.methodSelectorElement.appendChild(optionLabel);
    });

    this._updateMethodSelectorState();
  }

  _onMethodCheckboxChange(methodId, isChecked) {
    var selectedSet = new Set(this.selectedOptionalMethodIds);
    if (isChecked) {
      if (selectedSet.size >= this.config.maxComparisonMethods) {
        this._setMethodCheckboxValue(methodId, false);
        return;
      }
      selectedSet.add(methodId);
    } else {
      selectedSet.delete(methodId);
    }

    this.selectedOptionalMethodIds = this.optionalMethods
      .map((methodConfig) => methodConfig.id)
      .filter((optionalMethodId) => selectedSet.has(optionalMethodId));

    this._updateMethodSelectorState();
    this._rebuildViewerGrid();
  }

  _setMethodCheckboxValue(methodId, isChecked) {
    var checkbox = this.methodSelectorElement.querySelector('input[data-method-id="' + methodId + '"]');
    if (checkbox) {
      checkbox.checked = isChecked;
    }
  }

  _updateMethodSelectorState() {
    var selectedCount = this.selectedOptionalMethodIds.length;
    var maxReached = selectedCount >= this.config.maxComparisonMethods;
    var optionLabels = this.methodSelectorElement.querySelectorAll('.dataset-viewer-method-option');

    optionLabels.forEach((optionLabel) => {
      var checkbox = optionLabel.querySelector('input[type="checkbox"]');
      if (!checkbox) {
        return;
      }

      checkbox.checked = this.selectedOptionalMethodIds.indexOf(checkbox.dataset.methodId) !== -1;
      checkbox.disabled = !checkbox.checked && maxReached;

      if (checkbox.disabled) {
        optionLabel.classList.add('is-disabled');
      } else {
        optionLabel.classList.remove('is-disabled');
      }
    });
  }

  _buildModelButtons() {
    this.buttonContainer.innerHTML = '';

    this.config.models.forEach((modelConfig) => {
      var button = document.createElement('button');
      button.className = 'button is-light dataset-viewer-model-button';
      button.type = 'button';
      button.textContent = modelConfig.label;
      button.dataset.modelId = modelConfig.id;
      var pointLabel = this.config.modelPointLabelById[modelConfig.id];
      if (pointLabel) {
        button.classList.add('has-point-label');
        button.dataset.pointLabel = pointLabel;
        button.setAttribute('aria-label', modelConfig.label + ' (' + pointLabel + ')');
      }
      button.addEventListener('click', () => {
        this.loadModel(modelConfig.id);
      });
      this.buttonContainer.appendChild(button);
    });
  }

  _setActiveButton(modelId) {
    var buttons = this.buttonContainer.querySelectorAll('button[data-model-id]');
    buttons.forEach((button) => {
      if (button.dataset.modelId === modelId) {
        button.classList.remove('is-light');
        button.classList.add('is-link');
      } else {
        button.classList.remove('is-link');
        button.classList.add('is-light');
      }
    });
  }

  _getMethodTimingPath(methodId) {
    return this.config.basePath + '/' + methodId + '/timings.txt';
  }

  _getMethodTimingData(methodId) {
    var timingPath = this._getMethodTimingPath(methodId);
    if (!DATASET_VIEWER_TIMINGS_CACHE.has(timingPath)) {
      var timingPromise = fetch(timingPath)
        .then((response) => {
          if (!response.ok) {
            throw new Error('timings unavailable');
          }
          return response.text();
        })
        .then((text) => {
          var modelToTiming = {};
          var lines = text.split(/\r?\n/);
          lines.forEach((line) => {
            var trimmed = line.trim();
            if (!trimmed) {
              return;
            }

            var pairMatch = trimmed.match(/^([^:]+):\s*([-+]?\d*\.?\d+)/);
            if (pairMatch) {
              modelToTiming[pairMatch[1].trim()] = parseFloat(pairMatch[2]);
              return;
            }

            var numberMatch = trimmed.match(/[-+]?\d*\.?\d+/);
            if (numberMatch) {
              modelToTiming.__default__ = parseFloat(numberMatch[0]);
            }
          });
          return modelToTiming;
        })
        .catch(() => ({}));

      DATASET_VIEWER_TIMINGS_CACHE.set(timingPath, timingPromise);
    }

    return DATASET_VIEWER_TIMINGS_CACHE.get(timingPath);
  }

  _formatTimingValue(value) {
    if (typeof value !== 'number' || !isFinite(value)) {
      return '--';
    }
    if (value > 120 * 60) {
      return (value / 3600).toFixed(1) + ' h';
    }
    if (value > 120) {
      return (value / 60).toFixed(1) + ' min';
    }
    return value.toFixed(1) + ' s';
  }

  _setCaptionTiming(viewerState, timingText) {
    if (!viewerState || !viewerState.captionElement) {
      return;
    }
    viewerState.captionElement.innerHTML = this._buildCaptionHTML(viewerState.methodLabel, timingText);
    this._fitCaptionToSingleLine(viewerState.captionElement);
  }

  _buildCaptionHTML(methodLabel, timingText) {
    return '<span class="dataset-viewer-caption-content">' +
      '<span class="dataset-viewer-caption-label">' + methodLabel + '</span>' +
      '<span class="dataset-viewer-caption-separator" aria-hidden="true">|</span>' +
      '<span class="icon is-small"><i class="far fa-clock" aria-hidden="true"></i></span>' +
      '<span class="dataset-viewer-caption-timing">' + timingText + '</span>' +
      '</span>';
  }

  _fitCaptionToSingleLine(captionElement) {
    if (!captionElement) {
      return;
    }

    var contentElement = captionElement.querySelector('.dataset-viewer-caption-content');
    if (!contentElement) {
      return;
    }

    var maxFontSizePx = 15.2; // 0.95rem baseline
    var minFontSizePx = 11.2; // 0.7rem floor
    contentElement.style.fontSize = maxFontSizePx + 'px';

    var computedStyle = window.getComputedStyle(captionElement);
    var horizontalPadding =
      (parseFloat(computedStyle.paddingLeft) || 0) +
      (parseFloat(computedStyle.paddingRight) || 0);
    var availableWidth = Math.max(0, captionElement.clientWidth - horizontalPadding);

    // Shrink text only when it overflows, keeping labels on one line.
    var current = maxFontSizePx;
    while (contentElement.scrollWidth > availableWidth && current > minFontSizePx) {
      current -= 0.3;
      contentElement.style.fontSize = current.toFixed(2) + 'px';
    }
  }

  _refreshCaption(viewerState) {
    if (!viewerState || viewerState.isDisposed || !viewerState.captionElement) {
      return;
    }

    this._getMethodTimingData(viewerState.methodId).then((timingData) => {
      if (!viewerState || viewerState.isDisposed || !viewerState.captionElement) {
        return;
      }

      var timingValue = timingData[this.currentModel];
      if (typeof timingValue !== 'number') {
        timingValue = timingData.__default__;
      }

      this._setCaptionTiming(viewerState, this._formatTimingValue(timingValue));
    });
  }

  _refreshAllCaptions() {
    this.viewerStates.forEach((viewerState) => {
      this._refreshCaption(viewerState);
    });
  }

  _createViewerState(methodConfig, canvasHost, statusElement, captionElement) {
    var width = canvasHost.clientWidth || 320;
    var height = canvasHost.clientHeight || width;

    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(1);
    renderer.setSize(width, height);
    renderer.outputEncoding = THREE.sRGBEncoding;
    canvasHost.appendChild(renderer.domElement);

    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf4f7fc);

    var camera = new THREE.PerspectiveCamera(40, width / height, 0.01, 100);
    camera.up.set(0, 1, 0);
    camera.position.copy(this.defaultViewState.position);

    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enablePan = true;
    controls.screenSpacePanning = true;
    controls.panSpeed = 1.0;
    controls.enableDamping = false;
    controls.target.copy(this.defaultViewState.target);
    controls.update();

    var ambient = new THREE.HemisphereLight(0xffffff, 0x5a6d87, 1.0);
    scene.add(ambient);

    var key = new THREE.DirectionalLight(0xffffff, 0.8);
    key.position.set(1.2, 1.6, 1.5);
    scene.add(key);

    var fill = new THREE.DirectionalLight(0xffffff, 0.3);
    fill.position.set(-1.5, 0.7, -1.0);
    scene.add(fill);

    var state = {
      methodId: methodConfig.id,
      methodLabel: methodConfig.label,
      methodColor: methodConfig.color,
      scene: scene,
      camera: camera,
      controls: controls,
      renderer: renderer,
      canvasHost: canvasHost,
      statusElement: statusElement,
      captionElement: captionElement,
      mesh: null,
      loadToken: 0,
      pendingTimeoutId: null,
      isDisposed: false
    };

    renderer.domElement.addEventListener('webglcontextlost', (event) => {
      event.preventDefault();
      if (!state.isDisposed) {
        this._setStatus(state, 'Recovering...');
        this._scheduleContextRecovery();
      }
    });

    renderer.domElement.addEventListener('webglcontextrestored', () => {
      if (state.isDisposed) {
        return;
      }
      this._scheduleContextRecovery();
    });

    controls.addEventListener('change', () => {
      this._syncFrom(state.methodId);
    });

    this._render(state);
    return state;
  }

  _syncFrom(sourceMethodId) {
    if (this.syncLock) {
      return;
    }
    var source = this.viewerByMethod[sourceMethodId];
    if (!source) {
      return;
    }

    this.syncLock = true;
    this.currentViewState = this._captureViewState(source);
    this.viewerStates.forEach((viewerState) => {
      if (viewerState.methodId !== sourceMethodId) {
        this._applyViewState(viewerState, this.currentViewState);
      }
    });
    this.syncLock = false;
    this._renderAll();
  }

  _captureViewState(viewerState) {
    return {
      position: viewerState.camera.position.clone(),
      target: viewerState.controls.target.clone(),
      up: viewerState.camera.up.clone(),
      zoom: viewerState.camera.zoom
    };
  }

  _cloneViewState(viewState) {
    return {
      position: viewState.position.clone(),
      target: viewState.target.clone(),
      up: (viewState.up || new THREE.Vector3(0, 1, 0)).clone(),
      zoom: viewState.zoom
    };
  }

  _applyViewState(viewerState, viewState) {
    viewerState.camera.position.copy(viewState.position);
    viewerState.camera.up.copy(viewState.up || new THREE.Vector3(0, 1, 0));
    viewerState.camera.zoom = viewState.zoom;
    viewerState.camera.updateProjectionMatrix();
    viewerState.controls.target.copy(viewState.target);
    viewerState.controls.update();
    this._render(viewerState);
  }

  _loadMeshIntoViewer(viewerState, meshPath, attempt) {
    var currentAttempt = attempt || 0;
    var loadToken = ++viewerState.loadToken;

    if (viewerState.pendingTimeoutId) {
      clearTimeout(viewerState.pendingTimeoutId);
      viewerState.pendingTimeoutId = null;
    }

    this._getProcessedGeometry(meshPath)
      .then((geometry) => {
        if (viewerState.isDisposed || loadToken !== viewerState.loadToken) {
          geometry.dispose();
          return;
        }

        if (viewerState.mesh) {
          viewerState.scene.remove(viewerState.mesh);
          viewerState.mesh.geometry.dispose();
          viewerState.mesh.material.dispose();
        }

        var material = new THREE.MeshStandardMaterial({
          color: viewerState.methodColor,
          roughness: 0.55,
          metalness: 0.1,
          side: THREE.DoubleSide
        });

        var mesh = new THREE.Mesh(geometry, material);
        viewerState.mesh = mesh;
        viewerState.scene.add(mesh);

        if (viewerState.methodId === this.config.alwaysVisibleMethodId && geometry.boundingSphere) {
          this._fitCenteredView(geometry.boundingSphere.radius);
        }

        this._applyViewState(viewerState, this.currentViewState);
        this._setStatus(viewerState, '');
      })
      .catch(() => {
        if (viewerState.isDisposed || loadToken !== viewerState.loadToken) {
          return;
        }
        if (currentAttempt < DATASET_VIEWER_MAX_LOAD_RETRIES - 1) {
          var nextAttempt = currentAttempt + 1;
          var retryDelayMs = Math.min(6000, 300 * Math.pow(2, nextAttempt));
          this._setStatus(viewerState, 'Retrying (' + (nextAttempt + 1) + '/' + DATASET_VIEWER_MAX_LOAD_RETRIES + ')...');
          viewerState.pendingTimeoutId = setTimeout(() => {
            if (viewerState.isDisposed || loadToken !== viewerState.loadToken) {
              return;
            }
            this._loadMeshIntoViewer(viewerState, meshPath, nextAttempt);
          }, retryDelayMs);
          return;
        }
        this._setStatus(viewerState, 'Mesh unavailable');
      });
  }

  _getProcessedGeometry(meshPath) {
    return new Promise((resolve, reject) => {
      var settled = false;
      var timeoutId = setTimeout(() => {
        if (settled) {
          return;
        }
        settled = true;
        reject(new Error('Mesh load timeout'));
      }, DATASET_VIEWER_LOAD_TIMEOUT_MS);

      this.plyLoader.load(
        meshPath,
        (rawGeometry) => {
          if (settled) {
            rawGeometry.dispose();
            return;
          }
          settled = true;
          clearTimeout(timeoutId);
          resolve(this._processGeometry(rawGeometry));
        },
        undefined,
        () => {
          if (settled) {
            return;
          }
          settled = true;
          clearTimeout(timeoutId);
          reject(new Error('Mesh unavailable'));
        }
      );
    });
  }

  _scheduleContextRecovery() {
    var nowMs = Date.now();
    if (nowMs - this.lastRecoveryAtMs < 1200) {
      return;
    }

    if (this.contextRecoveryScheduled) {
      return;
    }

    this.lastRecoveryAtMs = nowMs;
    this.contextRecoveryScheduled = true;
    this.viewerStates.forEach((viewerState) => {
      this._setStatus(viewerState, 'Recovering...');
    });

    setTimeout(() => {
      this.contextRecoveryScheduled = false;
      if (!this.gridElement || !document.body.contains(this.gridElement)) {
        return;
      }
      this._rebuildViewerGrid();
      this._renderAll();
    }, 0);
  }

  _processGeometry(geometry) {
    if (this.config.geometryRotationX !== 0) {
      geometry.rotateX(this.config.geometryRotationX);
    }
    geometry.computeBoundingBox();

    var bbox = geometry.boundingBox;
    var center = new THREE.Vector3();
    var size = new THREE.Vector3();
    bbox.getCenter(center);
    bbox.getSize(size);

    var maxAxis = Math.max(size.x, size.y, size.z) || 1;
    var scale = 1.8 / maxAxis;

    geometry.translate(-center.x, -center.y, -center.z);
    geometry.scale(scale, scale, scale);
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();

    return geometry;
  }

  _setStatus(viewerState, text) {
    viewerState.statusElement.textContent = text;
  }

  _getMeshPath(methodId, modelId) {
    return this.config.basePath + '/' + methodId + '/' + modelId + this.config.meshFileSuffix + '.ply';
  }

  _fitCenteredView(radius) {
    var safeRadius = Math.max(radius || 1, 0.7);
    var referenceViewer = this.viewerStates[0];
    var fovRadians = THREE.MathUtils.degToRad(referenceViewer ? referenceViewer.camera.fov : 40);
    var aspect = referenceViewer ? referenceViewer.camera.aspect : 1;
    var verticalDistance = safeRadius / Math.tan(fovRadians / 2);
    var horizontalFov = 2 * Math.atan(Math.tan(fovRadians / 2) * aspect);
    var horizontalDistance = safeRadius / Math.tan(horizontalFov / 2);
    var distance = Math.max(verticalDistance, horizontalDistance) * 1.15;

    this.currentViewState = {
      position: this._getConfiguredViewPosition(distance, this.currentRenderParams),
      target: new THREE.Vector3(0, 0, 0),
      up: this._getUpVector(this.currentRenderParams),
      zoom: 1
    };

    this.viewerStates.forEach((state) => {
      this._applyViewState(state, this.currentViewState);
    });
  }

  _getRenderParamsForModel(modelId) {
    var modelParams = this.config.renderParamsByModel && this.config.renderParamsByModel[modelId]
      ? this.config.renderParamsByModel[modelId]
      : {};

    return {
      planeAngleDeg: typeof modelParams.planeAngleDeg === 'number' ? modelParams.planeAngleDeg : (this.config.defaultPlaneAngleDeg || 0),
      pitchAngleDeg: typeof modelParams.pitchAngleDeg === 'number' ? modelParams.pitchAngleDeg : (this.config.defaultPitchAngleDeg || 0),
      upAxis: typeof modelParams.upAxis === 'string' ? modelParams.upAxis : 'Y',
      isoAngleDeg: typeof modelParams.isoAngleDeg === 'number' ? modelParams.isoAngleDeg : 0
    };
  }

  _axisNameToVector(axisName) {
    switch ((axisName || 'Y').toUpperCase()) {
      case 'X': return new THREE.Vector3(1, 0, 0);
      case '-X': return new THREE.Vector3(-1, 0, 0);
      case 'Y': return new THREE.Vector3(0, 1, 0);
      case '-Y': return new THREE.Vector3(0, -1, 0);
      case 'Z': return new THREE.Vector3(0, 0, 1);
      case '-Z': return new THREE.Vector3(0, 0, -1);
      default: return new THREE.Vector3(0, 1, 0);
    }
  }

  _getUpVector(renderParams) {
    return this._axisNameToVector(renderParams && renderParams.upAxis ? renderParams.upAxis : 'Y');
  }

  _getConfiguredViewPosition(distance, renderParams) {
    var params = renderParams || this.currentRenderParams || this._getRenderParamsForModel(this.currentModel);
    var planeRad = THREE.MathUtils.degToRad(params.planeAngleDeg || 0);
    var pitchRad = THREE.MathUtils.degToRad(params.pitchAngleDeg || 0);
    var cosPitch = Math.cos(pitchRad);
    var position = new THREE.Vector3(
      distance * Math.sin(planeRad) * cosPitch,
      distance * Math.sin(pitchRad),
      distance * Math.cos(planeRad) * cosPitch
    );

    var isoAngleDeg = params.isoAngleDeg || 0;
    if (isoAngleDeg !== 0) {
      var isoAxis = this._axisNameToVector(params.upAxis || 'Y').normalize();
      position.applyAxisAngle(isoAxis, THREE.MathUtils.degToRad(isoAngleDeg));
    }

    return position;
  }

  _bindKeyboardReset() {
    document.addEventListener('keydown', (event) => {
      if (event.key !== 'r' && event.key !== 'R') {
        return;
      }
      var target = event.target;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }
      event.preventDefault();
      this.resetAllViews();
    });
  }

  _bindResize() {
    window.addEventListener('resize', () => {
      this.viewerStates.forEach((viewerState) => {
        var width = viewerState.canvasHost.clientWidth || 320;
        var height = viewerState.canvasHost.clientHeight || width;
        viewerState.camera.aspect = width / height;
        viewerState.camera.updateProjectionMatrix();
        viewerState.renderer.setSize(width, height);
        this._fitCaptionToSingleLine(viewerState.captionElement);
        this._render(viewerState);
      });
    });
  }

  _render(viewerState) {
    if (!viewerState || viewerState.isDisposed) {
      return;
    }

    try {
      viewerState.renderer.render(viewerState.scene, viewerState.camera);
    } catch (error) {
      this._scheduleContextRecovery();
    }
  }

  _renderAll() {
    if (this._hasLostContext()) {
      this._scheduleContextRecovery();
      return;
    }

    this.viewerStates.forEach((viewerState) => {
      this._render(viewerState);
    });
  }

  _hasLostContext() {
    for (var i = 0; i < this.viewerStates.length; i++) {
      var viewerState = this.viewerStates[i];
      if (!viewerState || viewerState.isDisposed || !viewerState.renderer) {
        continue;
      }

      try {
        var context = viewerState.renderer.getContext();
        if (context && typeof context.isContextLost === 'function' && context.isContextLost()) {
          return true;
        }
      } catch (error) {
        return true;
      }
    }

    return false;
  }

  _startRenderHeartbeat() {
    if (!DATASET_VIEWER_ENABLE_RENDER_HEARTBEAT) {
      return;
    }

    if (this.renderHeartbeatId) {
      return;
    }

    // Keep each viewer independently refreshed at a low rate so buffered
    // canvas content does not appear blank after unrelated WebGL activity.
    this.renderHeartbeatId = setInterval(() => {
      if (document.hidden) {
        return;
      }
      if (!this.gridElement || this.gridElement.offsetParent === null) {
        return;
      }
      this._renderAll();
    }, DATASET_VIEWER_CONTEXT_WATCHDOG_INTERVAL_MS);
  }

  dispose() {
    if (this.renderHeartbeatId) {
      clearInterval(this.renderHeartbeatId);
      this.renderHeartbeatId = null;
    }
    this._disposeViewerGrid();
  }
}

function initSingleDatasetViewerByGrid(gridId) {
  var config = DATASET_VIEWER_CONFIGS_BY_GRID.get(gridId);
  if (!config || DATASET_VIEWER_INSTANCES_BY_GRID.has(gridId)) {
    return;
  }

  var gridEl = document.getElementById(gridId);
  if (!gridEl || gridEl.offsetParent === null) {
    return;
  }

  var viewer = new SyncedMeshGridViewer(config);
  viewer.init();
  DATASET_VIEWER_INSTANCES_BY_GRID.set(gridId, viewer);
}

function disposeSingleDatasetViewerByGrid(gridId) {
  var viewer = DATASET_VIEWER_INSTANCES_BY_GRID.get(gridId);
  if (!viewer) {
    return;
  }

  viewer.dispose();
  DATASET_VIEWER_INSTANCES_BY_GRID.delete(gridId);
}

function initDatasetViewers() {
  var configs = createDatasetViewerConfigs();
  DATASET_VIEWER_CONFIGS_BY_GRID.clear();
  DATASET_VIEWER_INSTANCES_BY_GRID.clear();
  configs.forEach((config) => {
    DATASET_VIEWER_CONFIGS_BY_GRID.set(config.gridId, config);
  });

  if (window.location.protocol === 'file:') {
    configs.forEach((config) => {
      var grid = document.getElementById(config.gridId);
      if (grid) {
        grid.innerHTML = '<p class="has-text-centered">Please run this page via a local server (http://localhost) to load meshes and assets.</p>';
      }
    });
    return;
  }

  if (!window.THREE || !window.THREE.OrbitControls || !window.THREE.PLYLoader) {
    return;
  }

  configs.forEach((config) => {
    if (!config.lazyInit) {
      initSingleDatasetViewerByGrid(config.gridId);
    }
  });
}

function initImageCompareSliders() {
  var renderCompareBadge = function(badgeElement, methodName, runtimeText, vramText) {
    if (!badgeElement) {
      return;
    }

    badgeElement.innerHTML =
      '<span class="image-compare-badge-inline">' +
      '<span class="image-compare-badge-title">' + methodName + '</span>' +
      '<span class="image-compare-badge-separator" aria-hidden="true">|</span>' +
      '<span class="image-compare-badge-meta"><span class="icon"><i class="far fa-clock" aria-hidden="true"></i></span><span>' + runtimeText + '</span></span>' +
      '<span class="image-compare-badge-separator" aria-hidden="true">|</span>' +
      '<span class="image-compare-badge-meta"><span class="icon"><i class="fas fa-microchip" aria-hidden="true"></i></span><span>' + vramText + '</span></span>' +
      '</span>';
  };

  var compareBlocks = Array.from(document.querySelectorAll('.image-compare'));
  compareBlocks.forEach((block) => {
    var compareId = block.dataset.compare;
    var slider = block.querySelector('.image-compare-slider');
    var baseImage = block.querySelector('.image-compare-base');
    var overlay = block.querySelector('.image-compare-overlay');
    var divider = block.querySelector('.image-compare-divider');
    var leftBadge = block.querySelector('[data-compare-left-badge]');
    var rightBadge = block.querySelector('[data-compare-right-badge]');
    var baselineInputs = compareId
      ? Array.from(document.querySelectorAll('[data-compare-baseline-for="' + compareId + '"]'))
      : [];
    if (!slider || !baseImage || !overlay || !divider) {
      return;
    }

    var rightNsSrc = block.dataset.rightNsSrc || baseImage.getAttribute('src') || '';
    var rightSpsrSrc = block.dataset.rightSpsrSrc || rightNsSrc;

    renderCompareBadge(leftBadge, 'VKSR', '4 min', '3 GB (VRAM)');

    var getSelectedBaseline = function() {
      var checkedInput = baselineInputs.find(function(input) {
        return !!input.checked;
      });
      return checkedInput ? checkedInput.value : 'ns';
    };

    var syncBaselineCheckboxes = function(changedInput) {
      if (!baselineInputs || baselineInputs.length === 0) {
        return;
      }

      if (changedInput && changedInput.checked) {
        baselineInputs.forEach(function(input) {
          if (input !== changedInput) {
            input.checked = false;
          }
        });
      }

      var anyChecked = baselineInputs.some(function(input) {
        return !!input.checked;
      });
      if (!anyChecked) {
        var nsInput = baselineInputs.find(function(input) {
          return input.value === 'ns';
        });
        if (nsInput) {
          nsInput.checked = true;
        }
      }
    };

    var updateRightBaseline = function() {
      var useSpsr = getSelectedBaseline() === 'spsr';
      if (useSpsr) {
        baseImage.src = rightSpsrSrc;
        baseImage.alt = 'Siren Room rendering by SPSR';
        renderCompareBadge(rightBadge, 'SPSR', '2 min', '5 GB (RAM)');
      } else {
        baseImage.src = rightNsSrc;
        baseImage.alt = 'Siren Room rendering by NS';
        renderCompareBadge(rightBadge, 'Neural Splines', '7 h', '6 GB (VRAM)');
      }
    };

    var update = function() {
      var value = Math.max(0, Math.min(100, parseFloat(slider.value) || 50));
      var rightInset = 100 - value;
      overlay.style.clipPath = 'inset(0 ' + rightInset + '% 0 0)';
      overlay.style.webkitClipPath = 'inset(0 ' + rightInset + '% 0 0)';

      var blockRect = block.getBoundingClientRect();
      var splitX = (value / 100) * blockRect.width;

      if (leftBadge) {
        var leftRect = leftBadge.getBoundingClientRect();
        var leftBadgeLeft = leftRect.left - blockRect.left;
        var leftBadgeRight = leftBadgeLeft + leftRect.width;
        var leftInsetRightPx = Math.max(0, leftBadgeRight - splitX);
        leftBadge.style.opacity = '1';
        leftBadge.style.clipPath = 'inset(0 ' + leftInsetRightPx + 'px 0 0)';
        leftBadge.style.webkitClipPath = 'inset(0 ' + leftInsetRightPx + 'px 0 0)';
      }

      if (rightBadge) {
        var rightRect = rightBadge.getBoundingClientRect();
        var rightBadgeLeft = rightRect.left - blockRect.left;
        var rightInsetLeftPx = Math.max(0, splitX - rightBadgeLeft);
        rightBadge.style.opacity = '1';
        rightBadge.style.clipPath = 'inset(0 0 0 ' + rightInsetLeftPx + 'px)';
        rightBadge.style.webkitClipPath = 'inset(0 0 0 ' + rightInsetLeftPx + 'px)';
      }

      divider.style.left = value + '%';
    };

    slider.addEventListener('input', update);
    slider.addEventListener('change', update);
    baselineInputs.forEach(function(input) {
      input.addEventListener('change', function() {
        syncBaselineCheckboxes(input);
        updateRightBaseline();
      });
    });

    syncBaselineCheckboxes(null);
    updateRightBaseline();
    update();
  });
}


$(document).ready(function() {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

    });

    var options = {
      slidesToScroll: 1,
      slidesToShow: 3,
      loop: true,
      infinite: true,
      autoplay: false,
      autoplaySpeed: 3000,
    }

    // Initialize carousels only when they have child slides.
    try {
      var carouselNodes = Array.from(document.querySelectorAll('.carousel')).filter(function(node) {
        return node.children.length > 0;
      });
      var carousels = bulmaCarousel.attach(carouselNodes, options);

      // Loop on each carousel initialized
      for (var i = 0; i < carousels.length; i++) {
        // Add listener to  event
        carousels[i].on('before:show', function(state) {
        console.log(state);
        });
      }
    } catch (error) {
      console.warn('Carousel initialization skipped:', error);
    }

    // Access to bulmaCarousel instance of an element
    var element = document.querySelector('#my-element');
    if (element && element.bulmaCarousel) {
    	// bulmaCarousel instance is available as element.bulmaCarousel
    	element.bulmaCarousel.on('before-show', function(state) {
    		console.log(state);
    	});
    }

    bulmaSlider.attach();
    initImageCompareSliders();
    initShapeNetViewerTabs();
    initDatasetViewers();

})
