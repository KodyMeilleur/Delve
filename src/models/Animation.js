const skipFrameMap = {
  // delay frames
  walk: [2, 2]
}

const bumpAnimationMap = {
  // pixels to bump by on frame
  walk: {
    2: {
      vertical: -32,
      horizontal: 0
    },
  },
}

export function Animation(maxNumberOfFrames, state, loop) {
  this.maxNumberOfFrames = maxNumberOfFrames;
  this.state = state;
  this.currentFrame = 0;
  this.shouldLoop = loop;
  this.skipFrames = [];
  this.bumpFrames = bumpAnimationMap[state] || null;
  if (skipFrameMap[state]) {
    this.skipFrames = skipFrameMap[state].slice();
  }
  this.refreshSkipFrames = function() {
    if (skipFrameMap[this.state]) {
      this.skipFrames = skipFrameMap[this.state].slice();
    }
  }
}
