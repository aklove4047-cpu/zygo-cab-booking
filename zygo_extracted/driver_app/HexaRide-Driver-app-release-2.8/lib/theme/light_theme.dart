import 'package:flutter/material.dart';
import 'package:ride_sharing_user_app/theme/custom_theme_colors.dart';

ThemeData lightTheme = ThemeData(
  fontFamily: 'SFProText',

  // 🔵 Logo Teal/Blue
  primaryColor: const Color(0xFF1F6F8B),
  primaryColorDark: const Color(0xFF0F4C5C),

  disabledColor: const Color(0xFFBABFC4),
  brightness: Brightness.light,
  hintColor: const Color(0xFF9F9F9F),
  cardColor: Colors.white,

  extensions: <ThemeExtension<CustomThemeColors>>[CustomThemeColors.light()],

  colorScheme: const ColorScheme.light(
    // 🔵 Primary (logo blue)
    primary: Color(0xFFE6F3F6),

    surface: Color(0xFFF7FAFA),
    error: Color(0xFFFF6767),

    // 🔵 Secondary (teal)
    secondary: Color(0xFF1F6F8B),

    // 🟡 Taxi Yellow
    tertiary: Color(0xFFF4C430),
    tertiaryContainer: Color(0xFFFFE08A),

    secondaryContainer: Color(0xFF1F6F8B),

    onTertiary: Color(0xFF1D2D2B),
    onSecondary: Colors.white,
    onSecondaryContainer: Color(0xFFA8C5C1),
    onTertiaryContainer: Color(0xFF425956),

    outline: Color(0xFFB0BEC5),
    onPrimaryContainer: Color(0xFFDEFFFB),

    // 🟡 CTA container
    primaryContainer: Color(0xFFF4C430),

    onErrorContainer: Color(0xFFFFE6AD),
    onPrimary: Color(0xFF1F6F8B),

    surfaceTint: Color(0xFF1F6F8B),
    errorContainer: Color(0xFFF6F6F6),
    shadow: Color(0xFFE0F2F1),

    surfaceContainer: Color(0xFFEAF4F4),
    secondaryFixedDim: Color(0xFF808080),
  ),

  textButtonTheme: TextButtonThemeData(
    style: TextButton.styleFrom(
      foregroundColor: const Color(0xFF1F6F8B),
    ),
  ),

  textTheme: const TextTheme(
    displayLarge: TextStyle(
      fontWeight: FontWeight.w300,
      color: Color(0xFF1D2D2B),
    ),
    displayMedium: TextStyle(
      fontWeight: FontWeight.w300,
      color: Color(0xFF334257),
    ),
    displaySmall: TextStyle(
      fontWeight: FontWeight.w300,
      color: Color(0xFF48615E),
    ),
    bodyLarge: TextStyle(
      fontWeight: FontWeight.w300,
      color: Color(0xFF1D2D2B),
    ),
    bodyMedium: TextStyle(
      fontWeight: FontWeight.w300,
      color: Color(0xFF334257),
    ),
    bodySmall: TextStyle(
      fontWeight: FontWeight.w300,
      color: Color(0xFF6B7675),
    ),
  ),
);
