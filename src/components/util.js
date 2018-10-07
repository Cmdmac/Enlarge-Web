class Uri {
    constructor(path) {
        this.path = path;
    }

    splitPath(path) {
        let paths = path.split("/");
        this.dirs = paths;
    }

    lastDir() {
        return this.dirs[this.dirs.length];
    }

    dirs(index) {
        return this.dirs[index];
    }


}