(function (global) {
    const ns = global.bootcamp ??= {};

    const jQuerize = args => {
        if (args instanceof jQuery) return args;
        if (args instanceof Node || args instanceof NodeList) return $(args);
        return undefined;
    }

    ns.MultipleStateButton = class {
        static create(args = {}) {
            return (new ns.MultipleStateButton(args)).$element;
        }

        constructor(args = {}) {
            const myself = this;

            this.$element = jQuerize(args) ?? args.$element ?? $('<button>');
            this.$element.attr('data-bc-msbtn') ?? this.$element.attr({ 'data-bc-msbtn': '' });
            this.$element.data({ 'bc-msbtn-instance': this });

            this.transitionState = args.transitionState ?? (instance => {
                const length = instance.$element.children().length;
                const state = Number(instance.state);
                return (0 <= state && state < length) ? (state + 1) % length : 0;
            });

            // This event handler must be executed before any other click event handlers
            // because other handlers will expected a state of buttons after pushing them.
            const handlers = $._data(this.$element[0], 'events')?.click.map(handler => handler.handler) ?? [];
            handlers.forEach(handler => this.$element.off('click', handler));
            this.$element.click(function () {
                if (!myself.transitionOnClick) return;
                myself.state = myself.transitionState(myself);
            });
            handlers.forEach(handler => this.$element.click(handler));

            new MutationObserver(_ => {
                myself.$element.children().hide();
                myself.$element.children().eq(Number(myself.state)).show();
            })
                .observe(this.$element[0], {
                    childList: true,
                    attributes: true,
                    attributeFilter: ['data-bc-msbtn-state'],
                });

            this.$element.children().hide();
            this.$element.children().eq(Number(myself.state)).show();
        }

        get state() {
            return JSON.parse(this.$element.attr('data-bc-msbtn-state') ?? '0');
        }
        set state(newState) {
            this.$element.attr({ 'data-bc-msbtn-state': newState });
        }

        get transitionOnClick() {
            return JSON.parse(this.$element.attr('data-bc-msbtn-transition-on-click') ?? 'true');
        }
        set transitionOnClick(enabled) {
            this.$element.attr({ 'data-bc-msbtn-transition-on-click': newState });
        }
    };
}(this));
