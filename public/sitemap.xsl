<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:template match="/">
    <html>
      <head>
        <title>Sitemap</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          a { color: #0066cc; text-decoration: none; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <h1>XML Sitemap</h1>
        <p>This is an XML Sitemap which is supposed to be processed by search engines like Google, Bing, etc.</p>
        <p>You can find more information about XML sitemaps at <a href="http://sitemaps.org">sitemaps.org</a>.</p>
        <table>
          <tr>
            <th>URL</th>
            <th>Last Modified</th>
          </tr>
          <xsl:for-each select="s:urlset/s:url">
            <tr>
              <td><a href="{s:loc}"><xsl:value-of select="s:loc"/></a></td>
              <td><xsl:value-of select="s:lastmod"/></td>
            </tr>
          </xsl:for-each>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>