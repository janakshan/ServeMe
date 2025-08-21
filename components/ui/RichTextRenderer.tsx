import React from 'react';
import { Dimensions, StyleSheet, Text } from 'react-native';
import RenderHtml, { 
  HTMLContentModel, 
  HTMLElementModel,
  defaultSystemFonts 
} from 'react-native-render-html';
import { useEducationTheme } from '@/contexts/ScopedThemeProviders';

interface RichTextRendererProps {
  content: string;
  baseStyle?: any;
  maxWidth?: number;
}

export const RichTextRenderer: React.FC<RichTextRendererProps> = ({
  content,
  baseStyle,
  maxWidth
}) => {
  const { tokens } = useEducationTheme();
  const screenWidth = Dimensions.get('window').width;
  const contentWidth = maxWidth || screenWidth - 64; // Account for container padding
  
  // Debug logging to ensure content is received
  console.log('RichTextRenderer - Content length:', content?.length || 0);
  console.log('RichTextRenderer - Content preview:', content?.substring(0, 100) || 'No content');

  const systemFonts = [...defaultSystemFonts, 'System'];

  const customHTMLElementModels = {
    video: HTMLElementModel.fromCustomModel({
      tagName: 'video',
      contentModel: HTMLContentModel.block
    }),
    audio: HTMLElementModel.fromCustomModel({
      tagName: 'audio', 
      contentModel: HTMLContentModel.block
    })
  };

  const tagsStyles = {
    body: {
      color: tokens.colors.onSurface,
      fontSize: tokens.typography.body,
      lineHeight: 24,
      fontFamily: 'System',
    },
    p: {
      marginVertical: tokens.spacing.sm,
      color: tokens.colors.onSurface,
      fontSize: tokens.typography.body,
      lineHeight: 24,
    },
    h1: {
      color: tokens.colors.onSurface,
      fontSize: tokens.typography.title,
      fontWeight: tokens.typography.bold,
      marginVertical: tokens.spacing.md,
    },
    h2: {
      color: tokens.colors.onSurface,
      fontSize: tokens.typography.subtitle,
      fontWeight: tokens.typography.semiBold,
      marginVertical: tokens.spacing.md,
    },
    h3: {
      color: tokens.colors.onSurface,
      fontSize: tokens.typography.body,
      fontWeight: tokens.typography.semiBold,
      marginVertical: tokens.spacing.sm,
    },
    strong: {
      fontWeight: tokens.typography.bold,
      color: tokens.colors.onSurface,
    },
    em: {
      fontStyle: 'italic',
      color: tokens.colors.onSurfaceVariant,
    },
    ul: {
      marginVertical: tokens.spacing.sm,
      paddingLeft: tokens.spacing.md,
    },
    ol: {
      marginVertical: tokens.spacing.sm,
      paddingLeft: tokens.spacing.md,
    },
    li: {
      marginVertical: 2,
      color: tokens.colors.onSurface,
      fontSize: tokens.typography.body,
      lineHeight: 22,
    },
    blockquote: {
      borderLeftWidth: 4,
      borderLeftColor: tokens.colors.primary,
      paddingLeft: tokens.spacing.md,
      marginVertical: tokens.spacing.md,
      backgroundColor: tokens.colors.primary + '10',
      padding: tokens.spacing.md,
      borderRadius: tokens.borderRadius.md,
    },
    code: {
      backgroundColor: tokens.colors.surfaceVariant + '50',
      color: tokens.colors.primary,
      fontFamily: 'monospace',
      fontSize: tokens.typography.caption,
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 4,
    },
    pre: {
      backgroundColor: tokens.colors.surfaceVariant + '30',
      padding: tokens.spacing.md,
      borderRadius: tokens.borderRadius.md,
      marginVertical: tokens.spacing.sm,
      overflow: 'hidden',
    },
    a: {
      color: tokens.colors.primary,
      textDecorationLine: 'underline',
    },
    img: {
      borderRadius: tokens.borderRadius.md,
      marginVertical: tokens.spacing.sm,
    },
    video: {
      borderRadius: tokens.borderRadius.md,
      marginVertical: tokens.spacing.md,
      backgroundColor: tokens.colors.surfaceVariant + '20',
    },
    audio: {
      marginVertical: tokens.spacing.md,
      backgroundColor: tokens.colors.surfaceVariant + '20',
      borderRadius: tokens.borderRadius.md,
      padding: tokens.spacing.md,
    },
    table: {
      borderRadius: tokens.borderRadius.md,
      overflow: 'hidden',
      marginVertical: tokens.spacing.md,
    },
    th: {
      backgroundColor: tokens.colors.primary + '20',
      padding: tokens.spacing.sm,
      fontWeight: tokens.typography.semiBold,
      color: tokens.colors.onSurface,
    },
    td: {
      padding: tokens.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: tokens.colors.outline + '30',
      color: tokens.colors.onSurface,
    },
  };

  const classesStyles = {
    'highlight': {
      backgroundColor: tokens.colors.warning + '30',
      padding: 2,
      borderRadius: 4,
    },
    'success': {
      color: tokens.colors.primary,
      fontWeight: tokens.typography.semiBold,
    },
    'warning': {
      color: tokens.colors.warning,
      fontWeight: tokens.typography.semiBold,
    },
    'error': {
      color: tokens.colors.error,
      fontWeight: tokens.typography.semiBold,
    },
    'math-formula': {
      backgroundColor: tokens.colors.surfaceVariant + '30',
      padding: tokens.spacing.sm,
      borderRadius: tokens.borderRadius.sm,
      fontFamily: 'monospace',
      fontSize: tokens.typography.caption,
    },
  };

  // Custom renderers for media elements
  const renderers = {
    img: ({ TDefaultRenderer, ...props }: any) => {
      return (
        <TDefaultRenderer
          {...props}
          style={{
            ...props.style,
            borderRadius: tokens.borderRadius.md,
            maxWidth: '100%',
            height: 'auto',
          }}
        />
      );
    },
    video: ({ TDefaultRenderer, ...props }: any) => {
      // For now, render as a placeholder - could be enhanced with react-native-video
      return (
        <TDefaultRenderer
          {...props}
          style={{
            ...props.style,
            backgroundColor: tokens.colors.surfaceVariant + '50',
            padding: tokens.spacing.lg,
            borderRadius: tokens.borderRadius.md,
            textAlign: 'center',
            fontSize: tokens.typography.caption,
            color: tokens.colors.onSurfaceVariant,
          }}
        />
      );
    },
    audio: ({ TDefaultRenderer, ...props }: any) => {
      // For now, render as a placeholder - could be enhanced with expo-av
      return (
        <TDefaultRenderer
          {...props}
          style={{
            ...props.style,
            backgroundColor: tokens.colors.surfaceVariant + '50',
            padding: tokens.spacing.md,
            borderRadius: tokens.borderRadius.md,
            textAlign: 'center',
            fontSize: tokens.typography.caption,
            color: tokens.colors.onSurfaceVariant,
          }}
        />
      );
    },
  };

  // Check if content is valid HTML or just plain text
  const isHTML = content.includes('<') && content.includes('>');
  
  if (!content || content.trim().length === 0) {
    return (
      <Text style={{
        color: tokens.colors.onSurfaceVariant,
        fontSize: tokens.typography.body,
        fontStyle: 'italic',
        textAlign: 'center',
        padding: tokens.spacing.lg,
      }}>
        No detailed explanation available
      </Text>
    );
  }
  
  if (!isHTML) {
    // Render as plain text if not HTML
    return (
      <Text style={{
        color: tokens.colors.onSurface,
        fontSize: tokens.typography.body,
        lineHeight: 24,
        ...baseStyle,
      }}>
        {content}
      </Text>
    );
  }

  try {
    return (
      <RenderHtml
        contentWidth={contentWidth}
        source={{ html: content }}
        tagsStyles={tagsStyles}
        classesStyles={classesStyles}
        customHTMLElementModels={customHTMLElementModels}
        renderers={renderers}
        systemFonts={systemFonts}
        baseStyle={{
          color: tokens.colors.onSurface,
          fontSize: tokens.typography.body,
          lineHeight: 24,
          ...baseStyle,
        }}
        defaultTextProps={{
          selectable: true,
        }}
        enableExperimentalMarginCollapsing={true}
        ignoredDomTags={['script', 'style']}
      />
    );
  } catch (error) {
    console.warn('RichTextRenderer error:', error);
    // Fallback to plain text if HTML rendering fails
    return (
      <Text style={{
        color: tokens.colors.onSurface,
        fontSize: tokens.typography.body,
        lineHeight: 24,
        ...baseStyle,
      }}>
        {content.replace(/<[^>]*>/g, '')} {/* Strip HTML tags */}
      </Text>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});