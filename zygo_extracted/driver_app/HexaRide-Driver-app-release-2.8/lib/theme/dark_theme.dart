import 'package:flutter/material.dart';

import 'custom_theme_colors.dart';

ThemeData darkTheme = ThemeData(
  fontFamily: 'SFProText',

  // 🔵 Logo Blue / Teal
  primaryColor: const Color(0xFF1F6F8B),
  primaryColorDark: const Color(0xFF0F4C5C),

  brightness: Brightness.dark,
  cardColor: const Color(0xFF1C3B40),
  hintColor: const Color(0xFF9F9F9F),

  scaffoldBackgroundColor: const Color(0xFF0E2A2F),

  extensions: <ThemeExtension<CustomThemeColors>>[CustomThemeColors.dark()],

  colorScheme: const ColorScheme.dark(
    // 🔵 Primary (logo)
    primary: Color(0xFF1F6F8B),

    // 🟡 Taxi Yellow
    secondary: Color(0xFFF4C430),
    primaryContainer: Color(0xFFF4C430),

    error: Color(0xFFFF6767),

    tertiary: Color(0xFFF4C430),
    tertiaryContainer: Color(0xFF7A5A14),

    secondaryContainer: Color(0xFF1F6F8B),

    onPrimary: Colors.white,
    onSecondary: Color(0xFF1D2D2B),
    onSurface: Colors.white,

    onTertiary: Color(0xFF1D2D2B),
    onSecondaryContainer: Color(0xFFA8C5C1),
    onTertiaryContainer: Color(0xFFEAD89A),

    outline: Color(0xFF3FA9A2),
    onPrimaryContainer: Color(0xFFDEFFFB),

    surfaceContainer: Color(0xFF163D44),
    secondaryFixedDim: Color(0xFF808080),
  ),

  textButtonTheme: TextButtonThemeData(
    style: TextButton.styleFrom(
      foregroundColor: const Color(0xFFF4C430), // yellow CTA in dark
    ),
  ),

  textTheme: const TextTheme(
    displayLarge: TextStyle(
      fontWeight: FontWeight.w300,
      color: Colors.white,
    ),
    displayMedium: TextStyle(
      fontWeight: FontWeight.w300,
      color: Color(0xFFD5E1E0),
    ),
    displaySmall: TextStyle(
      fontWeight: FontWeight.w300,
      color: Color(0xFFD5E1E0),
    ),
    bodyLarge: TextStyle(
      fontWeight: FontWeight.w300,
      color: Colors.white,
    ),
    bodyMedium: TextStyle(
      fontWeight: FontWeight.w300,
      color: Colors.white,
    ),
    bodySmall: TextStyle(
      fontWeight: FontWeight.w300,
      color: Color(0xFFB0CFCB),
    ),
  ),
);
