// File tree auto re-sizer extension for vs code
(function () {
    let TreeViewAutoresize;

    module.exports = TreeViewAutoresize = {
        config: {
            minimumWidth: {
                type: 'integer',
                "default": 0,
                description: 'Minimum tree-view width. Put 0 if you don\'t want a min limit.'
            },
            maximumWidth: {
                type: 'integer',
                "default": 0,
                description: 'Maximum tree-view width. Put 0 if you don\'t want a max limit.'
            },
            padding: {
                type: 'integer',
                "default": 0,
                description: 'Add padding to the right side of the tree-view.'
            },
            animationMilliseconds: {
                type: 'integer',
                "default": 150,
                description: 'Number of milliseconds to elapse during animations. Smaller means faster.'
            },
            delayMilliseconds: {
                type: 'integer',
                "default": 100,
                description: 'Number of milliseconds to wait before animations. Smaller means faster.'
            }
        },
        subscriptions: null,
        conf: [],
        delayMs: 100,
        scrollbarWidth: require('scrollbar-width')(),
        activate () {
            return requestIdleCallback((function (_this) {
                return function () {
                    var CompositeDisposable, requirePackages;
                    requirePackages = require('atom-utils').requirePackages;
                    CompositeDisposable = require('atom').CompositeDisposable;
                    _this.subscriptions = new CompositeDisposable;
                    _this.observe('minimumWidth');
                    _this.observe('maximumWidth');
                    _this.observe('padding');
                    _this.observe('animationMilliseconds');
                    _this.observe('delayMilliseconds', false);
                    return requirePackages('tree-view').then(function (_arg) {
                        var treeView;
                        treeView = _arg[0];
                        if (treeView.treeView == null) {
                            treeView.createView();
                        }
                        _this.treePanel = treeView.treeView.element;
                        _this.treePanel.style.width = null;
                        _this.initTreeViewEvents();
                        return _this.resizeTreeView();
                    });
                };
            })(this));
        },
        deactivate () {
            this.treePanel.removeEventListener('click', this.bindClick);
            return this.subscriptions.dispose();
        },
        resizeTreeView () {
            return setTimeout((function (_this) {
                return function () {
                    if (_this.isInLeft()) {
                        return atom.workspace.getLeftDock().handleResizeToFit();
                    } else {
                        return atom.workspace.getRightDock().handleResizeToFit();
                    }
                };
            })(this), this.conf['delayMilliseconds']);
        },
        onClickDirectory (e) {
            var node;
            node = e.target;
            while (node !== null && node !== this.treePanel) {
                if (node.classList.contains('directory')) {
                    this.resizeTreeView();
                    return;
                }
                node = node.parentNode;
            }
        },
        isInLeft () {
            var node, _ref;
            node = this.treePanel.parentNode;
            while (node !== null) {
                if ((_ref = node.classList) != null ? _ref.contains('left') : void 0) {
                    return true;
                }
                node = node.parentNode;
            }
            return false;
        },
        setStyles () {
            var css;
            if (!this.style) {
                this.style = document.createElement('style');
                this.style.type = 'text/css';
            }
            css = this.generateCss();
            this.style.innerHTML = css;
            return document.body.appendChild(this.style);
        },
        observe (key, updateStyles) {
            if (updateStyles == null) {
                updateStyles = true;
            }
            return this.subscriptions.add(atom.config.observe("tree-view-autoresize." + key, (function (_this) {
                return function (value) {
                    _this.conf[key] = value;
                    if (updateStyles) {
                        return _this.setStyles();
                    }
                };
            })(this)));
        },
        initTreeViewEvents () {
            this.bindClick = this.onClickDirectory.bind(this);
            this.treePanel.addEventListener('click', this.bindClick);
            this.subscriptions.add(atom.project.onDidChangePaths(((function (_this) {
                return function () {
                    return _this.resizeTreeView();
                };
            })(this))));
            this.subscriptions.add(atom.commands.add('atom-workspace', {
                'tree-view:reveal-active-file': (function (_this) {
                    return function () {
                        return _this.resizeTreeView();
                    };
                })(this),
                'tree-view:toggle': (function (_this) {
                    return function () {
                        return _this.resizeTreeView();
                    };
                })(this),
                'tree-view:show': (function (_this) {
                    return function () {
                        return _this.resizeTreeView();
                    };
                })(this)
            }));
            return this.subscriptions.add(atom.commands.add('.tree-view', {
                'tree-view:open-selected-entry': (function (_this) {
                    return function () {
                        return _this.resizeTreeView();
                    };
                })(this),
                'tree-view:expand-item': (function (_this) {
                    return function () {
                        return _this.resizeTreeView();
                    };
                })(this),
                'tree-view:recursive-expand-directory': (function (_this) {
                    return function () {
                        return _this.resizeTreeView();
                    };
                })(this),
                'tree-view:collapse-directory': (function (_this) {
                    return function () {
                        return _this.resizeTreeView();
                    };
                })(this),
                'tree-view:recursive-collapse-directory': (function (_this) {
                    return function () {
                        return _this.resizeTreeView();
                    };
                })(this),
                'tree-view:move': (function (_this) {
                    return function () {
                        return _this.resizeTreeView();
                    };
                })(this),
                'tree-view:cut': (function (_this) {
                    return function () {
                        return _this.resizeTreeView();
                    };
                })(this),
                'tree-view:paste': (function (_this) {
                    return function () {
                        return _this.resizeTreeView();
                    };
                })(this),
                'tree-view:toggle-vcs-ignored-files': (function (_this) {
                    return function () {
                        return _this.resizeTreeView();
                    };
                })(this),
                'tree-view:toggle-ignored-names': (function (_this) {
                    return function () {
                        return _this.resizeTreeView();
                    };
                })(this),
                'tree-view:remove-project-folder': (function (_this) {
                    return function () {
                        return _this.resizeTreeView();
                    };
                })(this)
            }));
        },
        generateCss () {
            var css;
            css = "atom-dock.left  .atom-dock-open .atom-dock-content-wrapper:not(:active), atom-dock.left  .atom-dock-open .atom-dock-mask:not(:active), atom-dock.right .atom-dock-open .atom-dock-content-wrapper:not(:active), atom-dock.right .atom-dock-open .atom-dock-mask:not(:active) { transition: width " + this.conf['animationMilliseconds'] + "ms linear; }";
            if (this.conf['minimumWidth'] > 0) {
                css += "atom-dock.left .atom-dock-open .atom-dock-mask, atom-dock.right .atom-dock-open .atom-dock-mask { min-width: " + this.conf['minimumWidth'] + "px; } atom-dock.left  .atom-dock-open .atom-dock-mask .atom-dock-content-wrapper, atom-dock.right .atom-dock-open .atom-dock-mask .atom-dock-content-wrapper { min-width: " + this.conf['minimumWidth'] + "px; }";
            }
            if (this.conf['maximumWidth'] > 0) {
                css += "atom-dock.left .atom-dock-open .atom-dock-mask, atom-dock.right .atom-dock-open .atom-dock-mask { max-width: " + this.conf['maximumWidth'] + "px; } atom-dock.left  .atom-dock-open .atom-dock-mask .atom-dock-content-wrapper, atom-dock.right .atom-dock-open .atom-dock-mask .atom-dock-content-wrapper { max-width: " + this.conf['maximumWidth'] + "px; } atom-dock.left .tree-view, atom-dock.right .tree-view { overflow-x: scroll !important; }";
            }
            css += "atom-dock.left  .tree-view .full-menu, atom-dock.right .tree-view .full-menu { padding-right: " + (this.conf['padding'] + this.scrollbarWidth) + "px; } atom-dock.left  .tree-view, atom-dock.right .tree-view { overflow-x: hidden; }";
            return css;
        }
    };

}).call(this);