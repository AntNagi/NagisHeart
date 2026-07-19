package com.antnagi.nagisheart.ui.component

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.antnagi.nagisheart.ui.theme.NagiShapes
import com.antnagi.nagisheart.ui.viewmodel.DebugInfo

@Composable
fun DebugOverlay(
    debugInfo: DebugInfo,
    modifier: Modifier = Modifier,
    onJumpEnding: ((String) -> Unit)? = null
) {
    var expanded by remember { mutableStateOf(false) }

    Column(
        modifier = modifier.padding(8.dp),
        horizontalAlignment = Alignment.Start
    ) {
        // Compact badge — always visible
        Box(
            modifier = Modifier
                .clip(NagiShapes.cutSmall)
                .background(Color(0xCC000000))
                .clickable { expanded = !expanded }
                .padding(horizontal = 8.dp, vertical = 4.dp)
        ) {
            Text(
                text = "⬠ ${debugInfo.nodeId} | ${debugInfo.cursor}",
                color = Color(0xFFBFA08A),
                fontSize = 11.sp
            )
        }

        // Expanded panel
        AnimatedVisibility(visible = expanded) {
            Box(
                modifier = Modifier
                    .padding(top = 4.dp)
                    .widthIn(max = 300.dp)
                    .heightIn(max = 400.dp)
                    .clip(NagiShapes.cutSmall)
                    .background(Color(0xDD000000))
                    .padding(8.dp)
            ) {
                Column(
                    modifier = Modifier.verticalScroll(rememberScrollState())
                ) {
                    DebugLine("node", debugInfo.nodeId)
                    DebugLine("cursor", debugInfo.cursor)
                    DebugLine("route", debugInfo.route.ifEmpty { "(none)" })
                    DebugLine("mj", debugInfo.mj.ifEmpty { "(none)" })

                    Spacer(modifier = Modifier.height(4.dp))
                    Text("── variables ──", color = Color(0xFF6E7A89), fontSize = 10.sp)

                    val sorted = debugInfo.variables.entries
                        .sortedBy { it.key }
                    for ((key, value) in sorted) {
                        val display = when (value) {
                            is Boolean -> if (value) "true" else "false"
                            is Number -> value.toString()
                            is String -> if (value.isEmpty()) "(empty)" else value
                            else -> value.toString()
                        }
                        val highlight = value is Boolean && value ||
                                value is Number && value.toInt() != 0 ||
                                value is String && value.isNotEmpty()
                        DebugLine(
                            key, display,
                            valueColor = if (highlight) Color(0xFFC98A96) else Color(0xFF6E7A89)
                        )
                    }

                    if (onJumpEnding != null) {
                        Spacer(modifier = Modifier.height(8.dp))
                        Text("── test actions ──", color = Color(0xFF6E7A89), fontSize = 10.sp)
                        Spacer(modifier = Modifier.height(4.dp))
                        Box(
                            modifier = Modifier
                                .semantics { contentDescription = "debug_jump_true_end" }
                                .clip(NagiShapes.cutSmall)
                                .background(Color(0xFF8B2252))
                                .clickable { onJumpEnding("end_true") }
                                .padding(horizontal = 8.dp, vertical = 4.dp)
                        ) {
                            Text(
                                text = "DEBUG: Jump TRUE END",
                                color = Color(0xFFF4F1EA),
                                fontSize = 11.sp
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun DebugLine(
    label: String,
    value: String,
    valueColor: Color = Color(0xFFF7F9FC)
) {
    Row {
        Text(
            text = "$label: ",
            color = Color(0xFFAEBAC8),
            fontSize = 10.sp
        )
        Text(
            text = value,
            color = valueColor,
            fontSize = 10.sp
        )
    }
}
