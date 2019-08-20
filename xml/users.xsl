<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:template match="/">
        <html>
        <body>
        <h2> User Details </h2>
        <table border="1">
        <tr bgcolor="#9acd32">
        <th style="text-align:left">Name</th>
        <th style="text-align:left">Username</th>
        <th style="text-align:left">Email ID</th>
        <th style="text-align:left">Phone Number</th>
        </tr>
        <xsl:for-each select="users/user">
            <xsl:sort select="name"/>
            <xsl:if test="active = 'true">
                <tr>
                <td><xsl:value-of select="name"/></td>
                <td><xsl:value-of select="username"/></td>
                <td><a href="#"><xsl:value-of select="email"/></a></td>
                <td><xsl:value-of select="phoneNumber"/></td>
                </tr>
            </xsl:if>
        </xsl:for-each>
        </table>
        </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
