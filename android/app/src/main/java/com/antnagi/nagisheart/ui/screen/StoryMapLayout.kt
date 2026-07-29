package com.antnagi.nagisheart.ui.screen

internal data class StoryChapterPresentation(
    val kicker: String,
    val number: String,
    val title: String,
    val subtitle: String,
    val overviewCoverNode: String
)

internal val storyChapterPresentations = mapOf(
    "part1" to StoryChapterPresentation(
        "CHAPTER 01", "第一部", "初见",
        "从作战室到 U-20，日本第一次看见他的名字。", "p1"
    ),
    "part2" to StoryChapterPresentation(
        "CHAPTER 02", "第二部", "关系确立",
        "开放日之后，彼此的生活第一次真正重叠。", "c3"
    ),
    "part3" to StoryChapterPresentation(
        "CHAPTER 03", "第三部", "淘汰与重返",
        "刚确认彼此，就被赛程、失败与沉默推向远处。", "c6a"
    ),
    "part4" to StoryChapterPresentation(
        "CHAPTER 04", "第四部", "世界杯",
        "从追加名单到生死局，他重新站回世界的视线中央。", "wc_keygoal"
    ),
    "part5" to StoryChapterPresentation(
        "CHAPTER 05", "第五部", "归来与同居",
        "日常越靠越近，盛夏也把下一次远行带到门前。", "e_intimate_cohabit"
    ),
    "part6" to StoryChapterPresentation(
        "CHAPTER 06", "第六部", "曼城",
        "陌生城市、语言与赛场，让两个人学会新的靠近方式。", "club_arrival"
    ),
    "part7" to StoryChapterPresentation(
        "CHAPTER 07", "第七部", "假日与心意",
        "聚光灯之外，那些没说出口的心意在冬日里发热。", "e_scarf"
    ),
    "part8" to StoryChapterPresentation(
        "CHAPTER 08", "第八部", "世界中心",
        "同一个春天，通向三种不同的未来。", "dream_final"
    )
)

internal val storyImportantNodes = setOf(
    "p1", "c1a", "u20j",
    "c3", "e_lemontea", "e_invite",
    "e_depart", "c6a", "e_hug", "side_b_return",
    "wc_roster", "wc_keygoal", "wc_offer",
    "w_home", "e_intimate_cohabit", "w_game", "e_morning", "e_festival", "transfer_contract",
    "club_arrival", "club_training", "e_halloween", "e_drive",
    "e_agency_launch", "e_scarf", "e_softrice", "e_drunk",
    "p8_route", "dream_match", "dream_return", "dream_final",
    "stay_match", "stay_daily", "stay_final",
    "bad_plan", "bad_match", "bad_last", "bad_far"
)

internal fun storyRouteLabel(scope: String): String = when (scope) {
    "dream" -> "DREAM · 世界第一"
    "stay" -> "STAY · 陪我"
    "bad" -> "BAD · 抓住我"
    else -> scope
}

internal fun storyRoutePrefix(scope: String): String = when (scope) {
    "dream" -> "D"
    "stay" -> "S"
    "bad" -> "B"
    else -> ""
}

internal fun storyNodeCenterFraction(index: Int): Float =
    if (index % 2 == 0) 0.34f else 0.68f

internal fun storyDisplayTitle(title: String): String = when (title) {
    "同居·靠近 / 客气的距离" -> "同居·靠近\n客气的距离"
    "游戏冷战·ADC走脸事件" -> "游戏冷战\nADC走脸事件"
    "夏窗·签约桌上的好麻烦" -> "夏窗·签约桌上的\n好麻烦"
    "它翻译得很对，但不像我" -> "它翻译得很对\n但不像我"
    "花园别墅·秘密基地" -> "花园别墅\n秘密基地"
    "暗爽·可可白兰地" -> "暗爽\n可可白兰地"
    "他的名字，由我来写" -> "他的名字\n由我来写"
    "我不是不想这样赢" -> "我不是不想\n这样赢"
    else -> title
}
