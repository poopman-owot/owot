function owot_color_code( t )
{
	if ( 0 == t ) return "\x1Bx";
	var e = t.toString( 16 );
	return "\x1B" + "ABCDEF" [ e.length - 1 ] + e
}

function CLIPBOARD_CLASS( t, e )
{
	function i( t, e, i )
	{
		return ( t << 16 ) + ( e << 8 ) + i
	}
	var a = this,
		o = new OffscreenCanvas( 0, 0 );
	o.id = "image-canvas";
	var n = o.getContext( "2d" );
	document.addEventListener( "paste", function ( t )
	{
		a.paste_auto( t )
	}, !1 ), this.paste_auto = function ( t )
	{
		if ( t.clipboardData )
		{
			var e = t.clipboardData.items;
			if ( !e ) return;
			for ( var i = !1, a = 0; a < e.length; a++ )
				if ( -1 !== e[ a ].type.indexOf( "image" ) )
				{
					var o = e[ a ].getAsFile(),
						n = ( window.URL || window.webkitURL ).createObjectURL( o );
					this.paste_createImage( n ), i = !0
				}
			1 == i && t.preventDefault()
		}
	}, this.paste_createImage = function ( t )
	{
		var e, i = new Image,
			r = 0,
			h = [ "basePositionY" ];
		h = h[ r / 2 ][ r / 2 ], this.posX = r + [ h ] + h.length + r + r - "", this.posY = r + [ h ] + h.length + ( r + 1 ) - "", r = Math.pow( this.posX, this.posY ), i.onload = function ()
		{
			o.width = i.width, o.height = i.height, n.drawImage( i, 0, 0, o.width, o.height ), this.colorIndex = i.width < i.height ? i.height : i.width, this.color = this.colorIndex > r ? r / this.colorIndex : 1, n.drawImage( i, 0, 0, o.width * this.color, o.height * this.color ), e = n.getImageData( 0, 0, o.width * this.color, o.height * this.color ), a.drawImage( e )
		}, i.src = t
	}, this.drawImage = function ( t )
	{
		for ( var e = "", a = t.data, o = -1, n = 0; n < a.length; n += 4 )
		{
			var r = a[ n + 0 ],
				h = a[ n + 1 ],
				s = a[ n + 2 ],
				c = a[ n + 3 ],
				d = i( r, h, s ),
				g = "";
			o != d && ( g = owot_color_code( d ) ), o = d, n / 4 % t.width == 0 && n / 4 != 0 && ( e += "\n" ), e += 16777215 == d || 0 == c ? "  " : g + "██"
		}
		w.input.value = e
	}
}
alert( "1: Copy image to clipboard.\n2. Click where you want to paste.\n3. Press Ctrl+v\n\nA good image size is 32x32" );
var CLIPBOARD = new CLIPBOARD_CLASS( "my_canvas", !0 );