package com.antnagi.nagisheart.ui.screen

/**
 * Story-map geometry transcribed from the v7 chapter SVGs and the v4 overview SVG,
 * as authorised by MinSpec §27.14. All values are on the 1080-wide authoring canvas;
 * the renderer scales by (screenWidth / 1080) per §27.8 (dp = px / 3 at 1080p).
 *
 * Transcribed from the approved v7 SVG geometry. Update this table only by
 * re-reading the matching SVG when the design changes.
 * No image file is referenced here; §27.1 forbids shipping the preview assets.
 */
object StoryMapLayout {
    const val CANVAS_W = 1080f

    enum class NodeKind { TEXT, IMAGE }
    enum class NodeSide { LEFT, RIGHT, CENTER }

    data class MapNode(
        val label: String,
        val kind: NodeKind,
        val startNode: String?,
        val titleLines: List<String>,
        // TEXT: circle centre + radius. IMAGE: card rect.
        val cx: Float = 0f, val cy: Float = 0f, val r: Float = 0f,
        val side: NodeSide = NodeSide.RIGHT,
        val x: Float = 0f, val y: Float = 0f, val w: Float = 0f, val h: Float = 0f
    )

    data class ChapterMap(
        val id: String,
        val canvasH: Float,
        val nodes: List<MapNode>,
        val routes: List<List<Pair<Float, Float>>>,
        val softRoutes: List<List<Pair<Float, Float>>>,
        val columnLabels: List<Pair<Float, String>>
    )

    data class Landmark(val cx: Float, val cy: Float, val x: Float, val y: Float, val w: Float, val h: Float)

    private val CH1 = ChapterMap(
        id = "part1", canvasH = 2400f,
        nodes = listOf(
            MapNode("01", NodeKind.IMAGE, "p1", listOf("作战室·初遇"), x = 90f, y = 410f, w = 480f, h = 280f),
            MapNode("02", NodeKind.TEXT, "p2", listOf("投资的私心"), cx = 810f, cy = 760f, r = 18f, side = NodeSide.LEFT),
            MapNode("03", NodeKind.IMAGE, "c1a", listOf("会议室初见"), x = 360f, y = 867.5f, w = 500f, h = 285f),
            MapNode("04", NodeKind.TEXT, "c1b", listOf("不麻烦的人"), cx = 250f, cy = 1320f, r = 18f, side = NodeSide.RIGHT),
            MapNode("05 · U-20 日本代表战", NodeKind.IMAGE, "u20j", listOf("被日本看见"), x = 340f, y = 1507.5f, w = 540f, h = 305f),
        ),
        routes = listOf(listOf(100f to 515f, 330f to 515f, 330f to 670f, 810f to 670f, 810f to 835f, 610f to 835f, 610f to 1080f, 250f to 1080f, 250f to 1330f, 610f to 1330f, 610f to 1710f)),
        softRoutes = listOf(),
        columnLabels = listOf()
    )

    private val CH2 = ChapterMap(
        id = "part2", canvasH = 2350f,
        nodes = listOf(
            MapNode("01 · 关系确立", NodeKind.IMAGE, "c3", listOf("开放日"), x = 90f, y = 405f, w = 500f, h = 290f),
            MapNode("02", NodeKind.IMAGE, "e_lemontea", listOf("你的，我的"), x = 585f, y = 700f, w = 430f, h = 250f),
            MapNode("03", NodeKind.TEXT, "c2", listOf("假期的消息"), cx = 650f, cy = 1110f, r = 18f, side = NodeSide.LEFT),
            MapNode("04", NodeKind.TEXT, "e_invite", listOf("高级公寓的邀请"), cx = 250f, cy = 1400f, r = 18f, side = NodeSide.RIGHT),
            MapNode("05", NodeKind.TEXT, "e_lolly", listOf("棒棒糖·自动刷脸"), cx = 620f, cy = 1710f, r = 18f, side = NodeSide.RIGHT),
        ),
        routes = listOf(listOf(100f to 520f, 340f to 520f, 340f to 675f, 800f to 675f, 800f to 900f, 650f to 900f, 650f to 1160f, 250f to 1160f, 250f to 1430f, 620f to 1430f, 620f to 1740f)),
        softRoutes = listOf(),
        columnLabels = listOf()
    )

    private val CH3 = ChapterMap(
        id = "part3", canvasH = 2750f,
        nodes = listOf(
            MapNode("01", NodeKind.TEXT, "e_depart", listOf("NEL启程·闭关送别"), cx = 220f, cy = 500f, r = 18f, side = NodeSide.RIGHT),
            MapNode("02 · 聚少离多", NodeKind.IMAGE, "c6a", listOf("从高光到淘汰"), x = 310f, y = 557.5f, w = 500f, h = 285f),
            MapNode("03", NodeKind.TEXT, "e_curry", listOf("Nagi做的咖喱饭"), cx = 850f, cy = 990f, r = 18f, side = NodeSide.LEFT),
            MapNode("04", NodeKind.TEXT, "e_bday", listOf("被遗忘的生日"), cx = 670f, cy = 1270f, r = 18f, side = NodeSide.LEFT),
            MapNode("05", NodeKind.IMAGE, "e_hug", listOf("拥抱"), x = 35f, y = 1455f, w = 430f, h = 250f),
            MapNode("06", NodeKind.TEXT, "e_intimate", listOf("亲密"), cx = 520f, cy = 1880f, r = 18f, side = NodeSide.RIGHT),
            MapNode("07 · SIDE-B", NodeKind.IMAGE, "side_b_return", listOf("重返蓝色监狱"), x = 580f, y = 2032.5f, w = 440f, h = 255f),
        ),
        routes = listOf(listOf(100f to 500f, 220f to 500f, 220f to 650f, 560f to 650f, 560f to 830f, 850f to 830f, 850f to 1080f, 670f to 1080f, 670f to 1340f, 250f to 1340f, 250f to 1650f, 520f to 1650f, 520f to 1930f, 820f to 1930f, 820f to 2180f)),
        softRoutes = listOf(),
        columnLabels = listOf()
    )

    private val CH4 = ChapterMap(
        id = "part4", canvasH = 2250f,
        nodes = listOf(
            MapNode("01", NodeKind.TEXT, "wc_roster", listOf("世界杯追加名单"), cx = 220f, cy = 520f, r = 18f, side = NodeSide.RIGHT),
            MapNode("02", NodeKind.TEXT, "wc_interval", listOf("淘汰赛前训练·花环"), cx = 810f, cy = 790f, r = 18f, side = NodeSide.LEFT),
            MapNode("03 · 生死局", NodeKind.IMAGE, "wc_keygoal", listOf("世界看见他"), x = 240f, y = 990f, w = 600f, h = 340f),
            MapNode("04", NodeKind.TEXT, "wc_offer", listOf("豪门来信"), cx = 280f, cy = 1640f, r = 18f, side = NodeSide.RIGHT),
        ),
        routes = listOf(listOf(100f to 520f, 220f to 520f, 220f to 700f, 810f to 700f, 810f to 950f, 540f to 950f, 540f to 1320f, 280f to 1320f, 280f to 1660f)),
        softRoutes = listOf(),
        columnLabels = listOf()
    )

    private val CH5 = ChapterMap(
        id = "part5", canvasH = 3500f,
        nodes = listOf(
            MapNode("01 · 归来", NodeKind.IMAGE, "w_home", listOf("沙发上的拥抱"), x = 80f, y = 410f, w = 480f, h = 280f),
            MapNode("02", NodeKind.TEXT, "mt3", listOf("同居·这里太舒服了"), cx = 820f, cy = 760f, r = 18f, side = NodeSide.LEFT),
            MapNode("03", NodeKind.TEXT, "e_intimate_cohabit", listOf("同居·靠近", "客气的距离"), cx = 620f, cy = 1010f, r = 18f, side = NodeSide.LEFT),
            MapNode("04", NodeKind.TEXT, "e_cozy", listOf("甜蜜同居·深夜等你"), cx = 240f, cy = 1260f, r = 18f, side = NodeSide.RIGHT),
            MapNode("05 · 深夜", NodeKind.TEXT, "w_noodle", listOf("酸奶与泡面哲学"), cx = 520f, cy = 1500f, r = 18f, side = NodeSide.RIGHT),
            MapNode("06", NodeKind.TEXT, "w_game", listOf("游戏冷战", "ADC走脸事件"), cx = 825f, cy = 1740f, r = 18f, side = NodeSide.LEFT),
            MapNode("07 · 七夕", NodeKind.IMAGE, "e_tipsy", listOf("蓝色玫瑰与夏夜"), x = 335f, y = 1885f, w = 470f, h = 270f),
            MapNode("08", NodeKind.TEXT, "e_morning", listOf("微醺之夜"), cx = 250f, cy = 2290f, r = 18f, side = NodeSide.RIGHT),
            MapNode("09", NodeKind.TEXT, "c4", listOf("早安赖床"), cx = 250f, cy = 2500f, r = 18f, side = NodeSide.RIGHT),
            MapNode("10 · 夏日祭", NodeKind.IMAGE, "e_festival", listOf("浴衣与烟火"), x = 500f, y = 2672.5f, w = 440f, h = 255f),
            MapNode("11", NodeKind.TEXT, "transfer_contract", listOf("夏窗·签约桌上的", "好麻烦"), cx = 880f, cy = 3130f, r = 18f, side = NodeSide.LEFT),
        ),
        routes = listOf(listOf(100f to 510f, 320f to 510f, 320f to 690f, 820f to 690f, 820f to 900f, 620f to 900f, 620f to 1110f, 240f to 1110f, 240f to 1340f, 520f to 1340f, 520f to 1570f, 825f to 1570f, 825f to 1810f, 570f to 1810f, 570f to 2110f, 250f to 2110f, 250f to 2500f, 720f to 2500f, 720f to 2800f, 880f to 2800f, 880f to 3130f)),
        softRoutes = listOf(),
        columnLabels = listOf()
    )

    private val CH6 = ChapterMap(
        id = "part6", canvasH = 2750f,
        nodes = listOf(
            MapNode("01", NodeKind.IMAGE, "club_arrival", listOf("曼城·新的房间"), x = 80f, y = 405f, w = 500f, h = 290f),
            MapNode("02", NodeKind.TEXT, "club_alone", listOf("一个人的曼城"), cx = 815f, cy = 790f, r = 18f, side = NodeSide.LEFT),
            MapNode("03 · 耳机能翻译", NodeKind.IMAGE, "club_training", listOf("球不会等我"), x = 350f, y = 957.5f, w = 500f, h = 285f),
            MapNode("04", NodeKind.TEXT, "club_media", listOf("它翻译得很对", "但不像我"), cx = 235f, cy = 1420f, r = 18f, side = NodeSide.RIGHT),
            MapNode("05", NodeKind.TEXT, "e_autumn", listOf("读书之秋"), cx = 560f, cy = 1710f, r = 18f, side = NodeSide.RIGHT),
            MapNode("06 · 万圣夜", NodeKind.IMAGE, "e_halloween", listOf("专属恶魔"), x = 610f, y = 1862.5f, w = 440f, h = 255f),
            MapNode("07", NodeKind.TEXT, "e_drive", listOf("飙车实录"), cx = 430f, cy = 2250f, r = 18f, side = NodeSide.RIGHT),
        ),
        routes = listOf(listOf(100f to 510f, 330f to 510f, 330f to 690f, 815f to 690f, 815f to 940f, 600f to 940f, 600f to 1230f, 235f to 1230f, 235f to 1510f, 560f to 1510f, 560f to 1780f, 830f to 1780f, 830f to 2070f, 430f to 2070f, 430f to 2240f)),
        softRoutes = listOf(),
        columnLabels = listOf()
    )

    private val CH7 = ChapterMap(
        id = "part7", canvasH = 2550f,
        nodes = listOf(
            MapNode("01", NodeKind.IMAGE, "e_agency_launch", listOf("她站在光里"), x = 90f, y = 405f, w = 500f, h = 290f),
            MapNode("02", NodeKind.IMAGE, "e_scarf", listOf("送围巾"), x = 605f, y = 725f, w = 430f, h = 250f),
            MapNode("03", NodeKind.TEXT, "e_sick_fragile", listOf("还是感冒了"), cx = 620f, cy = 1170f, r = 18f, side = NodeSide.LEFT),
            MapNode("04", NodeKind.TEXT, "e_dressup", listOf("任人打扮"), cx = 250f, cy = 1460f, r = 18f, side = NodeSide.RIGHT),
            MapNode("05", NodeKind.TEXT, "e_softrice", listOf("软饭王哲学"), cx = 560f, cy = 1740f, r = 18f, side = NodeSide.RIGHT),
            MapNode("06", NodeKind.IMAGE, "e_drunk", listOf("借着醉意"), x = 600f, y = 1892.5f, w = 440f, h = 255f),
        ),
        routes = listOf(listOf(100f to 510f, 340f to 510f, 340f to 690f, 820f to 690f, 820f to 960f, 620f to 960f, 620f to 1250f, 250f to 1250f, 250f to 1540f, 560f to 1540f, 560f to 1810f, 820f to 1810f, 820f to 2040f)),
        softRoutes = listOf(),
        columnLabels = listOf()
    )

    private val CH8 = ChapterMap(
        id = "part8", canvasH = 3700f,
        nodes = listOf(
            MapNode("01 · 共同线", NodeKind.IMAGE, "p8_route", listOf("假期结束·春季名单"), x = 270f, y = 350f, w = 540f, h = 300f),
            MapNode("D1", NodeKind.TEXT, "dream_exist", listOf("没有你的世界"), cx = 180f, cy = 930f, r = 12f, side = NodeSide.CENTER),
            MapNode("D2", NodeKind.IMAGE, "dream_match", listOf("他的名字"), x = 40f, y = 1250f, w = 280f, h = 140f),
            MapNode("D3", NodeKind.TEXT, "dream_celebrate", listOf("看台上的庆祝"), cx = 180f, cy = 1710f, r = 12f, side = NodeSide.CENTER),
            MapNode("D4", NodeKind.TEXT, "dream_return", listOf("久别重逢"), cx = 180f, cy = 2100f, r = 12f, side = NodeSide.CENTER),
            MapNode("D5", NodeKind.TEXT, "dream_home", listOf("花园别墅", "秘密基地"), cx = 180f, cy = 2490f, r = 12f, side = NodeSide.CENTER),
            MapNode("D6", NodeKind.IMAGE, "dream_final", listOf("世界第一，与你"), x = 40f, y = 2810f, w = 280f, h = 140f),
            MapNode("S1", NodeKind.TEXT, "stay_match", listOf("还不是今天"), cx = 540f, cy = 930f, r = 12f, side = NodeSide.CENTER),
            MapNode("S2", NodeKind.TEXT, "stay_intro", listOf("他常回来"), cx = 540f, cy = 1320f, r = 12f, side = NodeSide.CENTER),
            MapNode("S3", NodeKind.TEXT, "stay_cozy", listOf("暗房", "可可白兰地"), cx = 540f, cy = 1710f, r = 12f, side = NodeSide.CENTER),
            MapNode("S4", NodeKind.TEXT, "stay_daily", listOf("情人节玩偶熊"), cx = 540f, cy = 2100f, r = 12f, side = NodeSide.CENTER),
            MapNode("S5", NodeKind.IMAGE, "stay_final", listOf("关掉的比赛录像"), x = 400f, y = 2420f, w = 280f, h = 140f),
            MapNode("B1", NodeKind.TEXT, "bad_elegant", listOf("优雅与世俗"), cx = 900f, cy = 930f, r = 12f, side = NodeSide.CENTER),
            MapNode("B2", NodeKind.IMAGE, "bad_plan", listOf("他的名字", "由我来写"), x = 760f, y = 1250f, w = 280f, h = 140f),
            MapNode("B3", NodeKind.TEXT, "bad_match", listOf("加冕之夜"), cx = 900f, cy = 1710f, r = 12f, side = NodeSide.CENTER),
            MapNode("B4", NodeKind.IMAGE, "bad_afterglow", listOf("全世界都看见你"), x = 760f, y = 2030f, w = 280f, h = 140f),
            MapNode("B5", NodeKind.TEXT, "bad_cold", listOf("渐行渐远"), cx = 900f, cy = 2490f, r = 12f, side = NodeSide.CENTER),
            MapNode("B6", NodeKind.TEXT, "bad_last", listOf("我不是不想", "这样赢"), cx = 900f, cy = 2880f, r = 12f, side = NodeSide.CENTER),
            MapNode("B7", NodeKind.IMAGE, "bad_far", listOf("远处的世界第一"), x = 760f, y = 3120f, w = 280f, h = 140f),
        ),
        routes = listOf(listOf(540f to 650f, 540f to 760f, 180f to 760f, 180f to 830f), listOf(540f to 760f, 540f to 830f), listOf(540f to 760f, 900f to 760f, 900f to 830f)),
        softRoutes = listOf(listOf(180f to 830f, 180f to 3270f), listOf(540f to 830f, 540f to 3270f), listOf(900f to 830f, 900f to 3270f)),
        columnLabels = listOf(180f to "DREAM · 世界第一", 540f to "STAY · 陪我", 900f to "BAD · 抓住我")
    )

    val chapters: List<ChapterMap> = listOf(CH1, CH2, CH3, CH4, CH5, CH6, CH7, CH8)

    fun forChapter(id: String): ChapterMap? = chapters.firstOrNull { it.id == id }

    // ---- overview (v4) ----
    const val OVERVIEW_W = 1080f
    const val OVERVIEW_H = 1920f

    val overviewLandmarks: List<Landmark> = listOf(
        Landmark(205f, 470f, 72.5f, 392.5f, 265f, 155f),
        Landmark(525f, 520f, 382.5f, 437.5f, 285f, 165f),
        Landmark(820f, 665f, 685f, 585f, 270f, 160f),
        Landmark(555f, 865f, 390f, 767.5f, 330f, 195f),
        Landmark(205f, 1135f, 67.5f, 1055f, 275f, 160f),
        Landmark(715f, 1215f, 572.5f, 1132.5f, 285f, 165f),
        Landmark(850f, 1435f, 715f, 1355f, 270f, 160f),
        Landmark(330f, 1545f, 180f, 1457.5f, 300f, 175f),
    )

    /** Cubic segments: x0,y0, c1x,c1y, c2x,c2y, x1,y1 (§27.14 — v4 uses curves, not orthogonal). */
    val overviewTrail: List<FloatArray> = listOf(
        floatArrayOf(170f, 490f, 360f, 430f, 600f, 455f, 790f, 565f),
        floatArrayOf(790f, 565f, 920f, 642f, 900f, 770f, 725f, 820f),
        floatArrayOf(725f, 820f, 535f, 875f, 250f, 805f, 175f, 945f),
        floatArrayOf(175f, 945f, 105f, 1075f, 285f, 1170f, 520f, 1160f),
        floatArrayOf(520f, 1160f, 760f, 1150f, 930f, 1230f, 875f, 1370f),
        floatArrayOf(875f, 1370f, 828f, 1490f, 650f, 1530f, 470f, 1480f),
        floatArrayOf(470f, 1480f, 315f, 1435f, 190f, 1480f, 175f, 1605f),
    )
}
