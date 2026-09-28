/*namespace photoapp;

entity Photoes {
    PhotoID : Integer;
    LocationID : Integer;
    MemberID : Integer;
    Title : String(50);
    Description : String(100);
    Privacy : String(20);
    UploadDate : Date;
    view : Integer;
    ImagePath : String(50);
    location : Association to Location;
    member : Association to Member;
    album : Association to Album;
    comments : Composition of many Comment on comments.photo = $self;
}

entity Location {
    LocationID : Integer;
    LocationName : String(50);
    ShortName : String(20);
    photos : Association to many Photoes on photos.location = $self;
}

entity Member {
    MemberID : Integer;
    MemberName : String(50);
    MemberPhno : String(50);
    MemberEmail : String(50);
    Address : String(50);
    photos : Association to many Photoes on photos.member = $self;
}

entity Comment {
    CommentID : Integer;
    PhotoID : Integer;
    PostDate : Date;
    Content : String(100);
    photo : Association to Photoes;
    
}

entity TagPhoto {
    TagphotoID : Integer;
    TagID : Integer;
    PhotoID : Integer;
    

}

entity Tag {
    TagID : Integer;
    Title : String(50);

    tag : Association to Tag; 
    photo : Association to Photoes;
}

entity Album {
    AlbumID : Integer;
    Title : String(50);
    Description : String(100);
    View : Integer;
    photos : Association to many Photoes on photos.album = $self;
}*/