package com.antnagi.nagisheart

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.core.view.WindowCompat
import androidx.navigation.compose.rememberNavController
import com.antnagi.nagisheart.ui.navigation.NagiNavGraph
import com.antnagi.nagisheart.ui.theme.NagiTheme
import com.antnagi.nagisheart.ui.theme.NagiUiTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            NagiTheme(uiTheme = NagiUiTheme.Dark) {
                val navController = rememberNavController()
                NagiNavGraph(navController = navController)
            }
        }
    }
}
