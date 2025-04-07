export enum WidgetType {
  common,
  button,
  three_d
}

export enum MessageSource {
  // The Message is sent from WebView to the React
  WebView,
  // The Message is sent from React to the WebView
  Hulk
}

export enum BaseMessagePurpose {
  initialize,
  updateWidgetData,
  triggerAction,
}


export enum BaseTriggerActions {
  onClick = 'onClick',
  onMouseEnter = 'onMouseEnter',
  onMouseLeave = 'onMouseLeave',
  onMouseMove = 'onMouseMove',
  onMouseOver = 'onMouseOver',
  onMouseOut = 'onMouseOut',
  onFocus = 'onFocus',
  onBlur = 'onBlur',
  onKeyDown = 'onKeyDown',
  onKeyPress = 'onKeyPress',
  onKeyUp = 'onKeyUp',
  onChange = 'onChange',
  onInput = 'onInput',
  onSubmit = 'onSubmit',
  onReset = 'onReset',
  onScroll = 'onScroll',
  onWheel = 'onWheel',
  onDrag = 'onDrag',
  onDragStart = 'onDragStart',
  onDragEnd = 'onDragEnd',
  onDragEnter = 'onDragEnter',
  onDragLeave = 'onDragLeave',
  onDragOver = 'onDragOver',
  onDragDrop = 'onDragDrop',
  onTouchStart = 'onTouchStart',
  onTouchMove = 'onTouchMove',
  onTouchEnd = 'onTouchEnd',
  onTouchCancel = 'onTouchCancel',
  onCopy = 'onCopy',
  onCut = 'onCut',
  onPaste = 'onPaste',
  onSelect = 'onSelect',
  onContextMenu = 'onContextMenu',
  onPlay = 'onPlay',
  onPause = 'onPause',
  onEnded = 'onEnded',
  onTimeUpdate = 'onTimeUpdate',
  onVolumeChange = 'onVolumeChange',
  onSeeking = 'onSeeking',
  onSeeked = 'onSeeked',
  onRateChange = 'onRateChange',
  onDurationChange = 'onDurationChange',
  onLoadedMetadata = 'onLoadedMetadata',
  onLoadedData = 'onLoadedData',
  onCanPlay = 'onCanPlay',
  onCanPlayThrough = 'onCanPlayThrough',
  onWaiting = 'onWaiting',
  onStalled = 'onStalled',
  onSuspend = 'onSuspend',
  onAbort = 'onAbort',
  onError = 'onError',
  onLoadStart = 'onLoadStart',
  onProgress = 'onProgress',
  onLoad = 'onLoad',
  onTransitionEnd = 'onTransitionEnd',
  onAnimationStart = 'onAnimationStart',
  onAnimationEnd = 'onAnimationEnd',
  onAnimationIteration = 'onAnimationIteration',
  onAnimationCancel = 'onAnimationCancel',
}