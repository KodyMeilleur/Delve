const skipFrameMap = {
  // delay frames, minimum must match max number of frames
  Jump: [0, 0, 1, 1, 2, 2, 3, 3, 4, 4],
  hurt: [0, 0],
  Idle: [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9]
}

const bumpAnimationMap = {
  // pixels to bump by on frame
  // Jump: {
  //   0: {
  //     vertical: 0,
  //     horizontal: 0
  //   },
  //   1: {
  //     vertical: -32,
  //     horizontal: 0
  //   },
  //   2: {
  //     vertical: -22,
  //     horizontal: 0
  //   },
  //   3: {
  //     vertical: -8,
  //     horizontal: 0
  //   },
  // },
}

export function Animation(maxNumberOfFrames, state, loop) {
  this.maxNumberOfFrames = maxNumberOfFrames;
  this.currentFrame = 0;
  this.state = state;
  this.shouldLoop = loop;
  this.skipFrames = [];
  this.bumpFrames = bumpAnimationMap[state] || null;
  // on creation check for skip frame data
  if (skipFrameMap[state]) {
    this.skipFrames = skipFrameMap[state].slice();
  }

  this.refreshSkipFrames = function() {
    if (skipFrameMap[this.state]) {
      // this.currentFrame = 0;
      this.skipFrames = skipFrameMap[this.state].slice();
    }
  }
}
