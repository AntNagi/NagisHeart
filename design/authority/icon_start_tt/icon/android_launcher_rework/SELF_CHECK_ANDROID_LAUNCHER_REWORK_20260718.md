# Self Check - Android Launcher Icon Rework

- [x] Third icon concept preserved: source is `app_icon_tt_candidate_1024.png`.
- [x] No Android code or Android resource directory was modified.
- [x] Adaptive background is light and fully opaque at all densities.
- [x] Foreground is larger than the previous small-card launcher read.
- [x] Round mask preview has no black edge / black block.
- [x] Squircle preview has no black edge / black block.
- [x] Legacy `ic_launcher.png` candidates are flattened so transparent corners cannot reveal launcher black.
- [x] Old `ic_launcher_round.png` is explicitly listed as cleanup candidate.

Known note: the master concept still includes the white rounded-rect card and gold decoration by design. This package fixes launcher mask/background behavior; it does not redesign the confirmed icon.
