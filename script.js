/* NexHire: horizontal navigation.
   Wheel + arrow keys move left/right, active nav link, slide-in reveal. */
(() => {
    const scroller = document.body;
    const panels = [...document.querySelectorAll('.hero, .section, footer')];
    const links = [...document.querySelectorAll('.navbar nav a')];

    document.documentElement.classList.add('js');

    // reveal panels + highlight the matching nav link
    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('in-view');
            if (entry.target.id) {
                links.forEach(a =>
                    a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
            }
        });
    }, { root: scroller, threshold: 0.55 });
    panels.forEach(p => io.observe(p));

    // step one panel at a time
    let locked = false;
    const go = dir => {
        if (locked) return;
        const i = Math.round(scroller.scrollLeft / window.innerWidth);
        const next = Math.max(0, Math.min(panels.length - 1, i + dir));
        scroller.scrollTo({ left: next * window.innerWidth, behavior: 'smooth' });
        locked = true;
        setTimeout(() => (locked = false), 650);
    };

    // vertical wheel -> horizontal, unless the panel itself still has room to scroll vertically
    scroller.addEventListener('wheel', e => {
        if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
        const p = e.target.closest('.hero, .section');
        if (p && p.scrollHeight > p.clientHeight + 1) {
            const atTop = p.scrollTop <= 0;
            const atBottom = p.scrollTop + p.clientHeight >= p.scrollHeight - 1;
            if ((e.deltaY < 0 && !atTop) || (e.deltaY > 0 && !atBottom)) return;
        }
        e.preventDefault();
        go(e.deltaY > 0 ? 1 : -1);
    }, { passive: false });

    window.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') go(1);
        if (e.key === 'ArrowLeft') go(-1);
    });
})();