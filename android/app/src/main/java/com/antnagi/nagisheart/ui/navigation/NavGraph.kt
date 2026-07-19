package com.antnagi.nagisheart.ui.navigation

import androidx.compose.runtime.*
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.antnagi.nagisheart.ui.component.NagiDialog
import com.antnagi.nagisheart.ui.screen.*
import com.antnagi.nagisheart.ui.viewmodel.GameViewModel

object Routes {
    const val SPLASH = "splash"
    const val START = "start"
    const val NAME_SETUP = "nameSetup"
    const val PROLOGUE = "prologue"
    const val CHAPTER_OPENING = "chapterOpening"
    const val SECTION_CLEAR = "sectionClear"
    const val GAME = "game"
    const val SAVE_LOAD = "saveLoad/{mode}"
    const val SETTINGS = "settings"
    const val BACKLOG = "backlog"
    const val CHAPTER = "chapter"
    const val GALLERY = "gallery"

    fun saveLoad(mode: String) = "saveLoad/$mode"
}

@Composable
fun NagiNavGraph(
    navController: NavHostController,
    gameViewModel: GameViewModel = viewModel()
) {
    val lifecycleOwner = LocalLifecycleOwner.current
    DisposableEffect(lifecycleOwner) {
        val observer = LifecycleEventObserver { _, event ->
            when (event) {
                Lifecycle.Event.ON_PAUSE -> {
                    gameViewModel.saveAutoProgress()
                    gameViewModel.pauseBgm()
                }
                Lifecycle.Event.ON_RESUME -> gameViewModel.resumeBgm()
                else -> {}
            }
        }
        lifecycleOwner.lifecycle.addObserver(observer)
        onDispose { lifecycleOwner.lifecycle.removeObserver(observer) }
    }

    NavHost(navController = navController, startDestination = Routes.SPLASH) {

        composable(Routes.SPLASH) {
            SplashScreen(
                onFinished = {
                    if (gameViewModel.hasPlayed()) {
                        navController.navigate(Routes.START) {
                            popUpTo(Routes.SPLASH) { inclusive = true }
                        }
                    } else {
                        navController.navigate(Routes.PROLOGUE) {
                            popUpTo(Routes.SPLASH) { inclusive = true }
                        }
                    }
                }
            )
        }

        composable(Routes.PROLOGUE) {
            PrologueScreen(
                lines = gameViewModel.getPrologueLines(),
                onFinished = {
                    navController.navigate(Routes.NAME_SETUP) {
                        popUpTo(Routes.PROLOGUE) { inclusive = true }
                    }
                }
            )
        }

        composable(Routes.NAME_SETUP) {
            NameSetupScreen(
                onConfirm = { name ->
                    gameViewModel.startNewGame(name, "Nagi")
                    gameViewModel.saveAutoProgress()
                    navController.navigate(Routes.CHAPTER_OPENING) {
                        popUpTo(Routes.NAME_SETUP) { inclusive = true }
                    }
                }
            )
        }

        composable(Routes.CHAPTER_OPENING) {
            val transition = gameViewModel.getChapterTransition()
            ChapterOpeningScreen(
                chapterName = transition?.chapterName ?: "第一部 · 原作前置篇",
                chapterTitle = transition?.chapterTitle ?: "他还没看见你",
                chapterSubtitle = "你已经看见了他",
                onContinue = {
                    navController.navigate(Routes.GAME) {
                        popUpTo(Routes.CHAPTER_OPENING) { inclusive = true }
                    }
                }
            )
        }

        composable(Routes.START) {
            val hasPlayed = gameViewModel.hasPlayed()
            var showNewGameConfirm by remember { mutableStateOf(false) }

            if (showNewGameConfirm) {
                NagiDialog(
                    onDismissRequest = { showNewGameConfirm = false },
                    title = "从头开始",
                    text = "当前自动进度将被覆盖，但手动存档不会删除。",
                    onConfirm = {
                        showNewGameConfirm = false
                        gameViewModel.resetAndStartNew()
                        navController.navigate(Routes.GAME) {
                            popUpTo(Routes.START) { inclusive = false }
                        }
                    },
                    onDismiss = { showNewGameConfirm = false }
                )
            }

            StartScreen(
                hasSave = hasPlayed,
                hasCompletedEnding = gameViewModel.hasCompletedEnding(),
                onContinue = {
                    if (gameViewModel.continueGame()) {
                        navController.navigate(Routes.GAME) {
                            popUpTo(Routes.START) { inclusive = false }
                        }
                    }
                },
                onStartNew = {
                    if (hasPlayed) {
                        showNewGameConfirm = true
                    } else {
                        gameViewModel.resetAndStartNew()
                        navController.navigate(Routes.GAME) {
                            popUpTo(Routes.START) { inclusive = false }
                        }
                    }
                },
                onSave = {
                    navController.navigate(Routes.saveLoad("load"))
                },
                onSettings = {
                    navController.navigate(Routes.SETTINGS)
                },
                onChapter = {
                    navController.navigate(Routes.CHAPTER)
                },
                onGallery = {
                    navController.navigate(Routes.GALLERY)
                }
            )
        }

        composable(Routes.GAME) {
            DisposableEffect(Unit) {
                onDispose {
                    gameViewModel.saveAutoProgress()
                }
            }

            GameScreen(
                viewModel = gameViewModel,
                onNavigateToSave = {
                    navController.navigate(Routes.saveLoad("save"))
                },
                onNavigateToBacklog = {
                    navController.navigate(Routes.BACKLOG)
                },
                onNavigateToBack = {
                    gameViewModel.saveAutoProgress()
                    navController.navigate(Routes.START) {
                        popUpTo(Routes.START) { inclusive = true }
                    }
                },
                onReplayFinished = {
                    navController.popBackStack()
                },
                onReturnToHome = {
                    navController.navigate(Routes.START) {
                        popUpTo(Routes.START) { inclusive = true }
                    }
                }
            )
        }

        composable(Routes.SAVE_LOAD) { backStackEntry ->
            val mode = backStackEntry.arguments?.getString("mode") ?: "save"
            SaveLoadScreen(
                mode = mode,
                viewModel = gameViewModel,
                onBack = { navController.popBackStack() },
                onLoaded = {
                    navController.navigate(Routes.GAME) {
                        popUpTo(Routes.START) { inclusive = false }
                    }
                }
            )
        }

        composable(Routes.SETTINGS) {
            SettingsScreen(
                viewModel = gameViewModel,
                onBack = { navController.popBackStack() }
            )
        }

        composable(Routes.BACKLOG) {
            BacklogScreen(
                viewModel = gameViewModel,
                onBack = { navController.popBackStack() }
            )
        }

        composable(Routes.CHAPTER) {
            ChapterScreen(
                viewModel = gameViewModel,
                onBack = { navController.popBackStack() },
                onJumpToNode = { nodeId ->
                    gameViewModel.jumpToChapter(nodeId)
                    navController.navigate(Routes.GAME) {
                        popUpTo(Routes.START) { inclusive = false }
                    }
                },
                onReplaySection = { startNode, chapterId, sectionIndex ->
                    gameViewModel.startReplay(startNode, chapterId, sectionIndex)
                    navController.navigate(Routes.GAME) {
                        popUpTo(Routes.CHAPTER) { inclusive = false }
                    }
                }
            )
        }

        composable(Routes.GALLERY) {
            GalleryScreen(
                viewModel = gameViewModel,
                onBack = { navController.popBackStack() }
            )
        }
    }
}
