/* eslint-disable */

/**
 * Abstract class
 * @class
 */

class MediaRepository {
  constructor() {
    if (this.constructor === MediaRepository) {
      throw new Error("Abstract classes can't be instantiated.");
    }
  }

  async createMedia(mediaData) {
    throw new Error("Not Implemented");
  }

  async findMediaById(mediaId) {
    throw new Error("Not Implemented");
  }

  async deleteMedia(mediaId) {
    throw new Error("Not Implemented");
  }
}

export default MediaRepository;
