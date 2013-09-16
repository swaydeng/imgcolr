package  
{
	import flash.display.Loader;
	
	/**
     * ...
     * @author Sway Deng
     */
    public class ImageLoader extends Loader {
        
        public var ignore:String;
        
        public function ImageLoader (ignore:String='') {
            super();
            
			this.ignore = ignore;
        }
        
    }

}